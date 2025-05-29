using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Repository;

public class JobApplicationRepository : RepositoryBase<JobApplication>, IJobApplicationRepository
{
    public JobApplicationRepository(RepositoryContext context) : base(context)
    {
    }

    public async Task<JobApplication> GetJobApplication(Guid jobId, Guid jobSeekerId)
    {
        return await FindByCondition(a => a.JobSeekerId.Equals(jobSeekerId) &&
                                          a.JobId.Equals(jobId)
        ).SingleAsync();
    }

    public async Task<IEnumerable<JobApplication>> GetApplicationsForJobSeekerAsync(JobSeeker jobSeeker)
    {
        return await FindByCondition(a => a.JobSeekerId.Equals(jobSeeker.Id))
            .Include(a => a.Job)
            .ThenInclude(j => j.Employer)
            .Include(a => a.JobSeeker)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<JobApplication>> GetApplicationsForJobAsync(Job job)
    {
        return await FindByCondition(a => a.JobId.Equals(job.Id))
            .Include(a => a.Job)
            .Include(a => a.JobSeeker)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
    }
    

    public async Task AddApplicationAsync(JobApplication jobApplication)
    {
        await Create(jobApplication);
    }

    public void UpdateApplication(JobApplication jobApplication)
    {
        Update(jobApplication);
    }

    public void DeleteApplication(JobApplication jobApplication)
    {
        Delete(jobApplication);
    }
}