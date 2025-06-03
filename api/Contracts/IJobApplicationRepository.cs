using Entities.Models;
using Shared.RequestFeatures;

namespace Contracts;

public interface IJobApplicationRepository
{
    Task<JobApplication> GetJobApplication(Guid jobId, Guid jobSeekerId);
    Task<PagedList<JobApplication>> GetApplicationsForJobSeekerAsync(JobSeeker jobSeeker, JobApplicationParameters jobApplicationParameters);
    Task<PagedList<JobApplication>> GetApplicationsForJobAsync(Job job, JobApplicationParameters jobApplicationParameters);
    Task AddApplicationAsync(JobApplication jobApplication);
    void UpdateApplication(JobApplication jobApplication);
    void DeleteApplication(JobApplication jobApplication);
}
