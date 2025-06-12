using Entities.Enums;
using Entities.Models;
using Shared.DataTransferObjects.AddressDtos;
using Shared.DataTransferObjects.JobDtos;
using Shared.DataTransferObjects.SkillDtos;

namespace Tests.Data;

public static class FakeJobs
{
    public static List<Job> Jobs => new()
    {
        new Job
        {
            Id = new Guid("a346f977-15ea-4144-a090-d943d33b21f8"),
            Title = "Software Engineer",
            Description = "In this position you will be working as a backend engineers making apis",
            Employer = FakeEmployers.SingleEmployer,
            EmployerId = FakeEmployers.SingleEmployer.Id,
            Address = new Address
            {
                Country = "Kosovo",
                City = "Prishtina",
                Street = "Bill Clinton",
                ZipCode = 21000
            },
            Benefits = new()
            {
                new JobBenefit
                {
                    Benefit = Benefit.PaidTimeOff,
                }
            }
        },
        new Job()
        {
            Id = Guid.NewGuid(),
            Title = "Web Developer",
            Description = "The employee will build the front end of our web apps",
            Employer = FakeEmployers.SingleEmployer,
            EmployerId = FakeEmployers.SingleEmployer.Id,
            Address = new Address
            {
                Country = "United States",
                City = "Baltimore",
                State = "Maryland",
                Street = "George Washington",
                ZipCode = 21800
            },
           
            Benefits = new()
            {
                new JobBenefit
                {
                    Benefit = Benefit.HealthInsurance,
                }
            }
        },
        new Job
        {
            Id = Guid.NewGuid(),
            Title = "Security Engineer",
            Description = "The employee will work on security",
            Employer = FakeEmployers.Employers[1],
            EmployerId = FakeEmployers.Employers[1].Id,
            Address = new Address
            {
                Country = "United States",
                City = "New York City",
                State = "New York",
                Street = "Abraham Lincoln",
                ZipCode = 14800
            },
            Benefits = new()
            {
                new JobBenefit
                {
                    Benefit = Benefit.HealthInsurance,
                }
            }
        }
};
    public static AddJobDto AddJobDto => new ()
    {
        Title = "Project Manager",
        Description = "The employee will lead and manage the team's projects",
        HourlyPay = 32.5,
        Address = new AddAddressDto
        {
            Country = "United States",
            City = "Philadelphia",
            State = "Pennsylvania",
            Street = "JFK Street",
            ZipCode = 41000
        },
       
        Benefits = ["HealthInsurance"]
    };
}
