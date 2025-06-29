using Entities.Enums;
using Entities.Models;
using Shared.RequestFeatures;


namespace Contracts;

public interface IJobRepository
{
     Task<PagedList<Job>> GetAllJobsAsync(JobParameters jobParameters, JobStatus status);
     Task <PagedList<Job>> GetJobsForEmployerAsync(Guid employerId,JobParameters jobParameters, JobStatus status);
     Task<Job> GetJobForEmployerAsync(Guid employerId, Guid id);
     Task AddJobAsync(Job job);
     void DeleteJob(Job job);
     void UpdateJob(Job job);
}
