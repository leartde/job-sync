using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.DataSeeders;

public class SeedJobData : IEntityTypeConfiguration<Job>
{
    private static readonly Job[] jobs = new Job[100];
    public static IReadOnlyList<Job> Jobs => jobs;
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        for (int i = 0; i < 100; i++)
        {
            Job job = new Job
            {
                Id = Guid.NewGuid(),
                EmployerId = SeedEmployerData.Employers[i].Id,
                Title = Faker.Company.Sector(),
                AddressId = SeedAddressData.Addresses[i].Id,
                HourlyPay = Faker.Number.RandomNumber(12, 50),
                Description = Faker.Lorem.Paragraph(),
                Type = i % 2 == 0 ? "FullTime" : "PartTime",
                ImageUrl = "https://picsum.photos/200/300",
                Status = JobStatus.Approved,
                IsTakingApplications = true,
                HasMultipleSpots = i % 2 == 0
            };
            jobs[i] = job;
        }
        builder.HasData(jobs);
    }
    
}
