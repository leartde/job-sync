using Entities.Enums;

namespace Shared.DataTransferObjects.JobApplicationDtos;

public abstract class JobApplicationDto
{
    public ApplicationStatus Status { get; set; }
}
