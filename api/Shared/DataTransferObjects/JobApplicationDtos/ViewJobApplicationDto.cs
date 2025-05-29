using Entities.Enums;

namespace Shared.DataTransferObjects.JobApplicationDtos;

public class ViewJobApplicationDto : JobApplicationDto
{
    public Guid? JobSeekerId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Employer { get; set; } = string.Empty;
    public string Candidate { get; set; } = string.Empty;
    public string StatusString { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid EmployerId { get; set; }

}