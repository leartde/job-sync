using Entities.Enums;

namespace Entities.Models;

public class Employer
{
    public Guid Id { get; set; }
    public AppUser? User { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Headquarters { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string Email { get; set; } = string.Empty;
    private Industry _industry;
    public Industry Industry {
        get => _industry;
        set
        {
            _industry = value;
            IndustryString = value.ToString();
        }
    }

    public string IndustryString { get; set; } = string.Empty;
    public DateOnly Founded { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? SecondaryPhone { get; set; } = string.Empty;
    public List<Job> Jobs { get; set; } = new();

   


}