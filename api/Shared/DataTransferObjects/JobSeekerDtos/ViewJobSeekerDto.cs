using Shared.DataTransferObjects.AddressDtos;
using Shared.DataTransferObjects.JobApplicationDtos;

namespace Shared.DataTransferObjects.JobSeekerDtos;

public class ViewJobSeekerDto : JobSeekerDto
{
    public Guid Id { get; set; }
    public string? Address { get; set; }
    public string? ResumeLink { get; set; }
    public string? ResumeName { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<string>? Skills { get; set; }
    public IEnumerable<JobApplicationDto>? JobApplications{ get; set; }
    public IEnumerable<string>? Bookmarks { get; set; }
}