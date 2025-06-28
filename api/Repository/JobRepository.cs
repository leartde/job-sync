using Contracts;
using Entities.Enums;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Extensions;
using Shared.RequestFeatures;

namespace Repository;

internal sealed class JobRepository : RepositoryBase<Job>, IJobRepository
{
    public JobRepository(RepositoryContext context) : base(context)
    {
    }


    public async Task<PagedList<Job>> GetAllJobsAsync(JobParameters jobParameters, JobStatus status)
    {
        List<Job> jobs = await FindByCondition(j=>j.Status == status)
            .Include(j => j.Employer)
            .Include(j => j.Address)
            .Include(j => j.Skills)
            .ThenInclude(s => s.Skill)
            .Include(j => j.Benefits)
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm)
            .Skip((jobParameters.PageNumber - 1) * jobParameters.PageSize)
            .Take(jobParameters.PageSize)   
            .Sort(jobParameters.OrderBy)
            .ToListAsync();

        int count = await FindByCondition(j=>j.Status == status)
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm)
            .CountAsync();

        return new PagedList<Job>(jobs, count, jobParameters.PageNumber, jobParameters.PageSize);
    }
  
    public async Task<PagedList<Job>> GetJobsForEmployerAsync(Guid employerId,JobParameters jobParameters, JobStatus status)
    {
        List<Job> jobs =  await FindByCondition(j => j.EmployerId.Equals(employerId)
          && j.Status == status
          )
            .Include(j => j.Employer)
            .Include(j => j.Address)
            .Include(j => j.Skills)
            .ThenInclude(s => s.Skill)
            .Include(j => j.Benefits)
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm ?? "")
            .Skip((jobParameters.PageNumber - 1) * jobParameters.PageSize)
            .Take(jobParameters.PageSize)   
            .Sort(jobParameters.OrderBy)
            .ToListAsync();
        
        int count = await FindByCondition(j => j.EmployerId.Equals(employerId)
          && j.Status == status
          )
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm ?? "")
            .CountAsync();
        return new PagedList<Job>(jobs, count, jobParameters.PageNumber, jobParameters.PageSize);

    }

    public async Task<Job> GetJobForEmployerAsync(Guid employerId, Guid id)
    {
            return await FindByCondition(j => j.EmployerId.Equals(employerId) && j.Id.Equals(id))
                .Include(j => j.Employer)
                .Include(j => j.Address)
                .Include(j => j.Benefits)
                .Include(j => j.Skills)
                .ThenInclude(s => s.Skill)
                .Include(j => j.Bookmarks)
                .Include(j => j.Applications)
                .SingleAsync();
    }

    public async Task AddJobAsync(Job job)
    {
        await Create(job);
    }

    public void DeleteJob(Job job)
    {
        Delete(job);
    }

    public void UpdateJob(Job job)
    {
        Update(job);
    }
}
