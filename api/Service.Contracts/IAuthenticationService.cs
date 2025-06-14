using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Shared.DataTransferObjects.UserDtos;

namespace Service.Contracts;

public interface IAuthenticationService
{
    Task<(IdentityResult Result, AppUser User)> RegisterUser(RegisterUserDto userDto);
    Task<List<ViewUserDto>> GetAllUsersAsync();
    Task<bool> ValidateUser(LoginUserDto userDto);
    Task<TokenDto> CreateToken(bool isPersistent);
    Task<TokenDto> RefreshToken(bool isPersistent);
    TokenDto GetToken();
    void ClearCookies();
}
