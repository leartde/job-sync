using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Shared.DataTransferObjects.UserDtos;
using Shared.RequestFeatures;

namespace Service.Contracts;

public interface IAuthenticationService
{
    Task<(IdentityResult Result, AppUser User)> RegisterUserAsync(RegisterUserDto userDto);
    Task<PagedList<ViewUserDto>> GetAllUsersAsync(AppUserParameters parameters);
    Task<ViewUserDto> GetUserAsync(Guid id);
    Task<bool> ValidateUserAsync(LoginUserDto userDto);
    Task DeleteUserAsync(Guid id);
    Task<TokenDto> CreateToken(bool isPersistent);
    Task<TokenDto> RefreshToken(bool isPersistent);
    TokenDto GetToken();
    void ClearCookies();
}
