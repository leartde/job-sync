

namespace Shared.DataTransferObjects.JobDtos;

public class ViewJobDto : JobDto
{
    public Guid Id { get; set; }
    public string Employer { get; set; } = string.Empty;
    public Guid EmployerId { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string? Pay { get; set; }
  
    public string Address { get; set; } = string.Empty;
    public  IEnumerable<string>? Skills { get; set; } 
    public string? ImageUrl { get; set; }
    public string? City { get; set; }


}
