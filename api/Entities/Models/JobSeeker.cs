namespace Entities.Models;
public class JobSeeker
{
    public Guid Id { get; set; }
    public AppUser? User { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = string.Empty;
    public DateOnly Birthday { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? SecondaryPhone { get; set; }
    public Address? Address { get; set; }
    public Guid? AddressId { get; set; }
    public string? ResumeLink { get; set; }
    public string? ResumeName { get; set; }
    public List<JobApplication> Applications { get; set; } = new();
    public List<Skill> Skills { get; set; } = new();
    public List<Bookmark> Bookmarks { get; set; } = new();

}