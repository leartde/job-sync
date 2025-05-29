using Entities.Enums;

namespace Shared.DataTransferObjects.JobApplicationDtos;

public class ViewJobApplicationDto : JobApplicationDto
{
  public Guid JobId { get; set; }
    public Guid? JobSeekerId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Employer { get; set; } = string.Empty;
    public string Candidate { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ResumeLink { get; set; } = string.Empty;
    public IEnumerable<string>? Skills { get; set; }
    public string StatusString { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid EmployerId { get; set; }

}
