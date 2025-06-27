using Entities.Models;
using Shared.DataTransferObjects.JobSeekerDtos;
using Shared.RequestFeatures;

namespace Service.Contracts;

public interface IJobSeekerService
{
    Task<PagedList<ViewJobSeekerDto>> GetAllJobSeekersAsync(JobSeekerParameters jobSeekerParameters);
    Task<ViewJobSeekerDto> GetJobSeekerAsync(Guid id);
    Task<ViewJobSeekerDto> GetJobSeekerByUserIdAsync(Guid id);
    Task<ViewJobSeekerDto> AddJobSeekerAsync(AddJobSeekerDto jobSeekerDto);
    Task<ViewJobSeekerDto> UpdateJobSeekerAsync(Guid id, UpdateJobSeekerDto jobSeekerDto);
    Task DeleteJobSeekerAsync(Guid id);
    Task DeleteResumeAsync(Guid id);

}
