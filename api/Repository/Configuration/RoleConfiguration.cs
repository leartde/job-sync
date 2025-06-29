using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configuration;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole<Guid>>
{
    

    public void Configure(EntityTypeBuilder<IdentityRole<Guid>> builder)
    {
        builder.HasData(
            new IdentityRole<Guid>
            {
                Id = new Guid("86117038-7f41-4dc8-8eec-9b18567123c4"),
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole<Guid>
            {
                Id = new Guid("91699a54-2a76-4247-b62e-8ebbca12d348"),
                Name = "Employer",
                NormalizedName = "EMPLOYER"
            },
            new IdentityRole<Guid>
            {
                Id = new Guid("36d37141-c65b-49f7-96fc-05356610c26a"),
                Name = "JobSeeker",
                NormalizedName = "JOBSEEKER"
            }
        );
    }
}
