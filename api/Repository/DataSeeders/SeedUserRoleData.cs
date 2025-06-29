using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.DataSeeders;

public class SeedUserRoleData : IEntityTypeConfiguration<IdentityUserRole<Guid>>
{
  private readonly IReadOnlyList<AppUser> _users = SeedUserData.Users;
  private static readonly IdentityUserRole<Guid>[] _userRoles = new IdentityUserRole<Guid>[200];
  private readonly Guid _employerRoleId = new Guid("91699a54-2a76-4247-b62e-8ebbca12d348");
  private readonly Guid _jobSeekerRoleId = new Guid("36d37141-c65b-49f7-96fc-05356610c26a");
  
  public void Configure(EntityTypeBuilder<IdentityUserRole<Guid>> builder)
  {
    for (int i = 0; i < 200; i++)
    {
      IdentityUserRole<Guid> userRole = new IdentityUserRole<Guid>
      {
        RoleId = i < 100 ? _employerRoleId : _jobSeekerRoleId,
        UserId = _users[i].Id
      };
      _userRoles[i] = userRole;
    }

    builder.HasData(_userRoles);
  }
}
