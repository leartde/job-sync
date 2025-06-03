using Entities.Models;
using Shared.DataTransferObjects.JobApplicationDtos;
using Shared.RequestFeatures;

namespace Service.Contracts;

public interface IJobApplicationService
{
    Task<ViewJobApplicationDto> GetApplicationAsync(Guid jobId, Guid jobSeekerId);
    Task<PagedList<ViewJobApplicationDto>> GetApplicationsForJobSeekerAsync(Guid jobSeekerId,JobApplicationParameters parameters);
    Task<PagedList<ViewJobApplicationDto>> GetApplicationsForJobAsync(Guid employerId, Guid jobId, JobApplicationParameters parameters);
    Task<ViewJobApplicationDto> AddApplicationAsync(Guid jobSeekerId, Guid jobId);

    Task<ViewJobApplicationDto> UpdateApplicationAsync(UpdateJobApplicationDTO jobApplicationDto,
        Guid employerId, Guid jobId, Guid jobSeekerId);
    Task DeleteApplicationAsync(Guid jobId, Guid jobSeekerId);
}
