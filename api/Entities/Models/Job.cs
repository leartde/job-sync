using System.Text;
using Entities.Enums;

namespace Entities.Models;

public class Job
{
    public Guid Id { get; set; }
    public Employer? Employer { get; set; }
    public Guid EmployerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public Address? Address { get; set; }
    public Guid? AddressId { get; set; }
    public double HourlyPay { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public bool IsTakingApplications { get; set; } = true;
    public bool HasMultipleSpots { get; set; }
    public DateOnly CreatedAt { get; set; } = DateOnly.MaxValue;
    public List<JobApplication> Applications { get; set; } = new();
    public List<JobSkill> Skills { get; set; } = new();
    public List<Bookmark> Bookmarks { get; set; } = new();
    public List<JobBenefit> Benefits { get; set; } = new();
}

   
