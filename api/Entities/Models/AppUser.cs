using Microsoft.AspNetCore.Identity;

namespace Entities.Models;

public class AppUser : IdentityUser<Guid>
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now; 
}
