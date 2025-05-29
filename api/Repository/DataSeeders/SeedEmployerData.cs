using Entities.Enums;
using Entities.Models;
using Faker;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.DataSeeders;

internal sealed class SeedEmployerData : IEntityTypeConfiguration<Employer>
{
    private static readonly Employer[] employers = new Employer[100];
    public static IReadOnlyList<Employer> Employers => employers;
    
    public void Configure(EntityTypeBuilder<Employer> builder)
    {
        for (int i = 0; i < 100; i++)
        {
            string name = Name.FullName();
            Employer employer = new Employer
            {
                Id = Guid.NewGuid(),
                UserId = SeedUserData.Users[i].Id,
                Name = name,
                Email = $"{name}@gmail.com",
                Description = Lorem.Paragraph(40),
                Headquarters = $"{Faker.Address.USCity()}, United States",
                Website = $"{name}.com/careers",
                Industry = (Industry)Number.RandomNumber(0,16),
                Founded = DateOnly.FromDateTime(Date.Birthday(0, 50)),
                Phone = Phone.GetPhoneNumber(),
                PhotoUrl = "https://picsum.photos/200/300"
            };
            employers[i] = employer;
        }

        builder.HasData(employers);
    }
}