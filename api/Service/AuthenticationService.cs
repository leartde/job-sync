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
using Shared.DataTransferObjects.EmployerDtos;
using Shared.DataTransferObjects.JobApplicationDtos;
using Shared.DataTransferObjects.JobSeekerDtos;
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

    public AuthenticationService(UserManager<AppUser> userManager, IConfiguration configuration, IRepositoryManager repository, IHttpContextAccessor contextAccessor)
    {
        _userManager = userManager;
        _configuration = configuration;
        _repository = repository;
        _httpContextAccessor = contextAccessor;
    }

    public async Task<(IdentityResult Result, AppUser User)> RegisterUser(RegisterUserDto userDto)
    {
        var user = new AppUser();
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
            string role = roles.First();
            ViewUserDto userDto = user.ToDto();
            userDto.Role = role;
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
    
    public async Task<TokenDto> CreateToken(bool rememberMe)
    {
        if (_user is null) throw new BadRequestException("User is null");
        SigningCredentials signingCredentials = GetSigningCredentials();
        List<Claim> claims = await GetClaims();
        JwtSecurityToken tokenOptions = GenerateTokenOptions(signingCredentials, claims);
        string refreshToken = GenerateRefreshToken();
        _user.RefreshToken = refreshToken;
        _user.RefreshTokenExpiryTime = rememberMe 
            ? DateTime.Now.AddDays(30) 
            : DateTime.Now.AddHours(8); 

        await _userManager.UpdateAsync(_user);
        string accessToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        SetCookie("accessToken", accessToken, 15);
        SetCookie("refreshToken", refreshToken, rememberMe ? 60 * 24 * 7 : 60 * 24 * 2);
        return new TokenDto(accessToken, refreshToken);
        
    }

    private void SetCookie(string key, string value, int minutes)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(minutes)
        };

        _httpContextAccessor.HttpContext?.Response.Cookies.Append(key, value, cookieOptions);
    }


    public async Task<TokenDto> RefreshToken(bool rememberMe)
    {
        string? refreshToken = _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            throw new RefreshTokenBadRequest();

        string? accessToken = _httpContextAccessor.HttpContext?.Request.Cookies["accessToken"];                                
        if (string.IsNullOrEmpty(accessToken))
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

        return await CreateToken(rememberMe);
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
        byte[] key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET") ?? throw new BadRequestException("Cannot access env variable \" SECRET\" "));
        SymmetricSecurityKey secret = new SymmetricSecurityKey(key);
        return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
    }
    
    private async Task<List<Claim>> GetRoleClaims()
    {
        List<Claim> claims = [];
        IList<string> roles = await _userManager.GetRolesAsync(_user ?? throw new BadRequestException(""));
        string role = roles.First();
        if (role == "JobSeeker")
        {
            JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerByUserIdAsync(_user.Id);
            ViewJobSeekerDto jobSeekerDto = jobSeeker.ToDto();
            claims.AddRange(
                [ new Claim("id",jobSeekerDto.Id.ToString()),
                    new Claim("role","jobseeker"),
                    new Claim("address",jobSeekerDto.Address ?? "")
                ]
                );
            claims.AddRange(from skill in jobSeekerDto.Skills ?? Enumerable.Empty<string>() select new Claim("skills", skill));
            claims.AddRange(from jobApplication in jobSeekerDto.JobApplications ?? Enumerable.Empty<JobApplicationDto>() select new Claim("jobApplications", jobApplication.ToString()));
            claims.AddRange(from bookmark in jobSeekerDto.Bookmarks ?? Enumerable.Empty<string>() select new Claim("bookmarks", bookmark));
        }

        if (role == "Employer")
        {
            Employer employer = await _repository.Employer.GetEmployerByUserIdAsync(_user.Id);
            ViewEmployerDto employerDto = employer.ToDto();
            claims.AddRange([
               new Claim("id",employer.Id.ToString()),
               new Claim("role","employer"),
            ]);
        }
        return claims;
    }
    private async Task<List<Claim>> GetClaims()
    {
        List<Claim> claims = [new Claim("email", _user?.Email ?? string.Empty)];
        List<Claim> roleClaims = await GetRoleClaims();
        claims.AddRange(roleClaims);
        if (_user == null) return claims;
        return claims;
    }

    private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
    {
        IConfigurationSection jwtSettings = _configuration.GetSection("JwtSettings");
        JwtSecurityToken tokenOptions = new JwtSecurityToken(issuer: jwtSettings["validIssuer"],
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
            ValidateAudience = true, ValidateIssuer = true, ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET") ?? throw new BadRequestException("Couldn't get env variable"))),
            ValidateLifetime = true, ValidIssuer = jwtSettings["validIssuer"],
            ValidAudience = jwtSettings["validAudience"]
        };
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken securityToken;
        ClaimsPrincipal principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
        JwtSecurityToken? jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
}