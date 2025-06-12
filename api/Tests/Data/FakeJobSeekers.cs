using Entities.Models;

namespace Tests.Data;

public static class FakeJobSeekers
{
    public static List<JobSeeker> JobSeekers =>
        new()
        {
            new JobSeeker
            {
                Id = new Guid("0d7aab1c-36a0-494e-ace0-6477a2b1203e"),
                FirstName = "Johny",
                LastName = "Walker",
                Address = new Address
                {
                    Country = "United States",
                    State = "Texas",
                    City = "Houston",
                    Street = "Cowboy Street",
                    ZipCode = 42000
                },
                Birthday = new DateOnly(1989, 01, 04),
               
                Gender = "Male",

            },
            new JobSeeker
            {
                Id = Guid.NewGuid(),
                FirstName = "Adam",
                LastName = "Smith",
                Address = new Address
                {
                    Country = "United States",
                    State = "Illinois",
                    City = "Chicago",
                    Street = "Woodrow Wilson St.",
                    ZipCode = 24900
                },
                Birthday = new DateOnly(1969, 04, 04),
                Gender = "Male",

            }
        };

}
