using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.DataSeeders;

public class SeedUserData : IEntityTypeConfiguration<AppUser>
{
    private readonly PasswordHasher<AppUser> passwordHasher = new();
    private static readonly AppUser[] users = new AppUser[200];
    
    public static IReadOnlyList<AppUser> Users => users;
    
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        
        for (int i = 0; i < 200; i++)
        {
                string email = Faker.User.Email();
                AppUser user = new AppUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    NormalizedEmail = email.ToUpper(),
                    UserName = email,
                    NormalizedUserName = email.ToUpper(),
                  
                };
                user.PasswordHash = passwordHasher.HashPassword(user, i < 100 ? "Employerpass123" : "Jobseekerpass123");
                users[i] = user;

        }
        builder.HasData(users);
    }
}
