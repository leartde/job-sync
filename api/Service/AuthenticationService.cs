using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Contracts;
using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.Contracts;
using Shared.DataTransferObjects.UserDtos;
using Shared.Mapping;
using Shared.RequestFeatures;

namespace Service;

internal sealed class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IRepositoryManager _repository;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private AppUser? _user;
    private readonly string _secret;
    private static readonly SemaphoreSlim _refreshLock = new(1, 1);

    public AuthenticationService(UserManager<AppUser> userManager, IConfiguration configuration, IRepositoryManager repository, IHttpContextAccessor contextAccessor)
    {
        _userManager = userManager;
        _configuration = configuration;
        _repository = repository;
        _httpContextAccessor = contextAccessor;
        _secret = Environment.GetEnvironmentVariable("SECRET") 
                  ?? throw new InvalidOperationException("Could not find \"SECRET\" env variable ");
    }

    public async Task<(IdentityResult Result, AppUser User)> RegisterUserAsync(RegisterUserDto userDto)
    {
      AppUser user = new AppUser();
        userDto.ToEntity(user);
        IdentityResult result = await _userManager.CreateAsync(user, userDto.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, userDto.Role);
        }
        _user = user;
        return (result, user);
    }

    public async Task<PagedList<ViewUserDto>> GetAllUsersAsync(AppUserParameters parameters)
    {
      List<AppUser> users = await _userManager.Users
        .ToListAsync();

      List<ViewUserDto> userDtos = [];
        foreach (AppUser user in users)
        {
          ViewUserDto userDto = user.ToDto();
          userDto.Role = await GetRole(user);
          userDtos.Add(userDto);
        }

        if (parameters.Role is not null)
        {
          userDtos = userDtos.Where(u => u.Role.ToLower().Equals(parameters.Role.ToLower())).ToList();
        }

        if (parameters.SearchTerm is not null)
        {
          userDtos = userDtos.Where(u => u.Email.ToLower().Contains(parameters.SearchTerm.ToLower())).ToList();
        }
        int count = userDtos.Count;
        userDtos = userDtos
          .Skip((parameters.PageNumber - 1) * parameters.PageSize)
          .Take(parameters.PageSize)
          .OrderBy(u => u.CreatedAt)
          .ToList();

       
        return new PagedList<ViewUserDto>(userDtos, count, parameters.PageNumber, parameters.PageSize);
        
    }
    public async Task<ViewUserDto> GetUserAsync(Guid id)
    {
      AppUser? user = await _userManager.FindByIdAsync(id.ToString());
      if (user is null) throw new NotFoundException(nameof(user), id);
      ViewUserDto userDto = user.ToDto();
      userDto.Role = await GetRole(user);
      return userDto;

    }
    public async Task<bool> ValidateUserAsync(LoginUserDto userDto)
    {
        _user = await _userManager.FindByEmailAsync(userDto.Email);
        bool result = _user != null && await _userManager.CheckPasswordAsync(_user, userDto.Password);
        return result;
    }

    public async Task DeleteUserAsync(Guid id)
    {
      AppUser? user = await _userManager.Users
        .AsNoTracking()
        .FirstOrDefaultAsync(u => u.Id.Equals(id));
      if (user is null) throw new NotFoundException(nameof(user), id);
      string role = await GetRole(user);
      switch (role)
      {
        case "Employer":
        {
          Employer employer = await _repository.Employer.GetEmployerByUserIdAsync(id);
          _repository.Employer.DeleteEmployer(employer);
          break;
        }
        case "JobSeeker":
        {
          JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerByUserIdAsync(id);
          _repository.JobSeeker.DeleteJobSeeker(jobSeeker);
          break;
        }
      }
      AppUser? userToDelete = await _userManager.FindByIdAsync(id.ToString());
      if (userToDelete is null) throw new BadRequestException("Can't delete user");
      await _userManager.DeleteAsync(userToDelete);
    }

    private async Task<string> GetRole(AppUser user)
    {
      IList<string> roles = await _userManager.GetRolesAsync(user);
      return roles.First();
    }

    public async Task<TokenDto> CreateToken(bool isPersistent)
    {
        if (_user is null) throw new BadRequestException("User is null");
        SigningCredentials signingCredentials = GetSigningCredentials();
        List<Claim> claims = await GetClaims();
        JwtSecurityToken tokenOptions = GenerateTokenOptions(signingCredentials, claims);
        string refreshToken = GenerateRefreshToken();
        _user.RefreshToken = refreshToken;
        _user.RefreshTokenExpiryTime = isPersistent 
            ? DateTime.Now.AddDays(30) 
            : DateTime.Now.AddHours(8); 
        await _userManager.UpdateAsync(_user);
        string accessToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        SetCookie("refreshToken", _user.RefreshToken, isPersistent ? 60 * 24 * 30 : 60 * 8);
        SetCookie("accessToken", accessToken, 15);
        return new TokenDto(accessToken, refreshToken);
    }

    private void SetCookie(string key, string value, int minutes)
    {
      CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(minutes)
        };

        _httpContextAccessor.HttpContext?.Response.Cookies.Append(key, value, cookieOptions);
    }


    public async Task<TokenDto> RefreshToken(bool isPersistent)
    {
      await _refreshLock.WaitAsync();
      try
      {
        string? refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
          throw new RefreshTokenBadRequest();

        AppUser? user = _userManager.Users.FirstOrDefault(
          u => u.RefreshToken != null && u.RefreshToken.Equals(refreshToken));
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now)
          throw new RefreshTokenBadRequest();
        _user = user;

        return await CreateToken(isPersistent);
      }
      finally
      {
        _refreshLock.Release();
      }
    }
    public TokenDto GetToken()
    {
      string? refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
      if (string.IsNullOrEmpty(refreshToken))
        throw new RefreshTokenBadRequest();
      string? accessToken = _httpContextAccessor.HttpContext?.Request.Cookies["accessToken"];
      if (string.IsNullOrEmpty(accessToken))
        throw new AccessTokenBadRequest();
      return new TokenDto(accessToken, refreshToken);
    }
    public void ClearCookies()
    {
        _httpContextAccessor.HttpContext?.Response.Cookies.Delete("accessToken");
        _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken");
    }
    private SigningCredentials GetSigningCredentials()
    {
      byte[] key = Encoding.UTF8.GetBytes(_secret);
    
      return new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha256);
    }
    private async Task<string> GetEmployerId(Guid userId)
    {
      if (_user is null) throw new BadRequestException("User not found");
      Employer employer = await _repository.Employer.GetEmployerByUserIdAsync(userId);
      return employer.Id.ToString();
    }
    private async Task<string> GetJobSeekerId(Guid userId)
    {
      if (_user is null) throw new BadRequestException("User not found");
      JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerByUserIdAsync(userId);
      return jobSeeker.Id.ToString();
    }
    private async Task<List<Claim>> GetClaims()
    {
        if (_user is null) throw new BadRequestException("User is null");
        string role = await GetRole(_user);
        List<Claim> claims =
        [
          new Claim(ClaimTypes.Email, _user?.Email ?? ""),
          new Claim(ClaimTypes.Role, role)
        ];

        switch (role)
        {
          case "Employer":
            if (_user != null) claims.Add(new Claim("id", await GetEmployerId(_user.Id)));
            break;
          case "JobSeeker":
            if (_user != null) claims.Add(new Claim("id", await GetJobSeekerId(_user.Id)));
            break;
        }
        return claims;
    }
    private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
    {
        IConfigurationSection jwtSettings = _configuration.GetSection("JwtSettings");
        JwtSecurityToken tokenOptions = new JwtSecurityToken(
          issuer: jwtSettings["validIssuer"],
            audience: jwtSettings["validAudience"], claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expires"])),
            signingCredentials: signingCredentials);
        return tokenOptions;
    }
    private string GenerateRefreshToken()
    {
        byte[] randomNumber = new byte[32];
        using RandomNumberGenerator rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
    
}
