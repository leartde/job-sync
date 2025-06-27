using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.DataSeeders;

public class SeedJobSeekerData : IEntityTypeConfiguration<JobSeeker>
{
  private static readonly JobSeeker[] jobSeekers = new JobSeeker[100];
  public static IReadOnlyList<JobSeeker> JobSeekers => jobSeekers;

  public void Configure(EntityTypeBuilder<JobSeeker> builder)
  {
    for (int i = 0; i < 100; i++)
    {
      JobSeeker jobSeeker = new JobSeeker
      {
        Id = Guid.NewGuid(),
        UserId = SeedUserData.Users[i + 100].Id,
        FirstName = i % 2 == 0 ? Faker.Name.MaleFirstName()
          : Faker.Name.FemaleFirstName(),
        LastName = Faker.Name.LastName(),
        AddressId = SeedAddressData.Addresses[i + 100].Id,
        Gender = i % 2 == 0 ? "Male" : "Female",
        Birthday = DateOnly.FromDateTime(Faker.Date.Birthday(18, 85)),
        Phone = Faker.Phone.GetPhoneNumber(),
      };
      jobSeekers[i] = jobSeeker;
    }

    builder.HasData(jobSeekers);
  }
}
