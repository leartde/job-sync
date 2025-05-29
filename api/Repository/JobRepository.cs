using Contracts;
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


    public async Task<PagedList<Job>> GetAllJobsAsync(JobParameters jobParameters)
    {
        List<Job> jobs = await FindAll()
            .Include(j => j.Employer)
            .Include(j => j.Address)
            .Include(j => j.Skills)
            .Include(j => j.Benefits)
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm ?? "")
            .Skip((jobParameters.PageNumber - 1) * jobParameters.PageSize)
            .Take(jobParameters.PageSize)   
            .Sort(jobParameters.OrderBy)
            .ToListAsync();

        int count = await FindAll()
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm ?? "")
            .CountAsync();

        return new PagedList<Job>(jobs, count, jobParameters.PageNumber, jobParameters.PageSize);
    }

    public async Task<PagedList<Job>> GetJobsForEmployerAsync(Guid employerId,JobParameters jobParameters)
    {
        List<Job> jobs =  await FindByCondition(j => j.EmployerId.Equals(employerId))
            .Include(j => j.Employer)
            .Include(j => j.Address)
            .Include(j => j.Skills)
            .Include(j => j.Benefits)
            .Filter(jobParameters.JobType,jobParameters.HasMultipleSpots,
                jobParameters.IsTakingApplications,jobParameters.IsRemote, jobParameters.MinimumPay)
            .Search(jobParameters.SearchTerm ?? "")
            .Skip((jobParameters.PageNumber - 1) * jobParameters.PageSize)
            .Take(jobParameters.PageSize)   
            .Sort(jobParameters.OrderBy)
            .ToListAsync();
        
        int count = await FindByCondition(j => j.EmployerId.Equals(employerId))
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