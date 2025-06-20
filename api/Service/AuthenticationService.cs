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

namespace Service;

internal sealed class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IRepositoryManager _repository;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private AppUser? _user;
    private string _secret;

    public AuthenticationService(UserManager<AppUser> userManager, IConfiguration configuration, IRepositoryManager repository, IHttpContextAccessor contextAccessor)
    {
        _userManager = userManager;
        _configuration = configuration;
        _repository = repository;
        _httpContextAccessor = contextAccessor;
        _secret = Environment.GetEnvironmentVariable("SECRET") 
                  ?? throw new InvalidOperationException("Could not find \"SECRET\" env variable ");
    }

    public async Task<(IdentityResult Result, AppUser User)> RegisterUser(RegisterUserDto userDto)
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

    public async Task<List<ViewUserDto>> GetAllUsersAsync()
    {
        List<AppUser> users = await _userManager.Users.ToListAsync();
        List<ViewUserDto> userDtos = [];
        foreach (AppUser user in users)
        {
            IList<string> roles = await _userManager.GetRolesAsync(user);
            ViewUserDto userDto = user.ToDto();
            if (roles.Count > 0)
            {
              string role = roles.First();
              userDto.Role = role;
            }
            
            userDtos.Add(userDto);
        }
        return userDtos;
        
    }

    public async Task<bool> ValidateUser(LoginUserDto userDto)
    {
        _user = await _userManager.FindByEmailAsync(userDto.Email);
        bool result = _user != null && await _userManager.CheckPasswordAsync(_user, userDto.Password);
        return result;
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
        SetCookie("refreshToken", refreshToken, isPersistent ? 60 * 24 * 30 : 60 * 8);
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

      string? accessToken = _httpContextAccessor.HttpContext.Request.Cookies["accessToken"];
      if (string.IsNullOrEmpty(accessToken))
      {
        throw new AccessTokenBadRequest();
      }
          string? refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
          if (string.IsNullOrEmpty(refreshToken))
              throw new RefreshTokenBadRequest();


          ClaimsPrincipal principal = GetPrincipalFromExpiredToken(accessToken);
          string email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? 
                         throw new BadRequestException("Null email")
                         ;

          if (string.IsNullOrEmpty(email))
              throw new RefreshTokenBadRequest();

          AppUser? user = await _userManager.FindByEmailAsync(email);
          if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
              throw new RefreshTokenBadRequest();

          _user = user;

          return await CreateToken(isPersistent);
    }

    public  TokenDto GetToken()
    {
      string? refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
      if (string.IsNullOrEmpty(refreshToken))
        throw new RefreshTokenBadRequest();
      string? accessToken = _httpContextAccessor.HttpContext?.Request.Cookies["accessToken"];                                
      if (string.IsNullOrEmpty(accessToken))
        throw new RefreshTokenBadRequest();
        
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
        List<Claim> claims = [new Claim(ClaimTypes.Email, _user?.Email ?? "" )];
        IList<string> roles = await _userManager.GetRolesAsync(_user ?? throw new BadRequestException("User is null"));
          claims.Add(new Claim(ClaimTypes.Role, roles.First()));

          if (roles.First() == "Employer")
          {
            claims.Add(new Claim("id",await GetEmployerId(_user.Id)));
          }
          else if (roles.First() == "JobSeeker")
          {
            claims.Add(new Claim("id",await GetJobSeekerId(_user.Id)));
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

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        IConfigurationSection jwtSettings = _configuration.GetSection("JwtSettings");
        TokenValidationParameters tokenValidationParameters = new TokenValidationParameters
        {
          ValidateAudience = true,
          ValidateIssuer = true,
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret)),
          ValidateLifetime = false, 
          ValidIssuer = jwtSettings["validIssuer"],
          ValidAudience = jwtSettings["validAudience"],
          ClockSkew = TimeSpan.Zero 
        };
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        ClaimsPrincipal principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
              StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
}
