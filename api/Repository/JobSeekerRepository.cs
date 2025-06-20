using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Extensions;
using Shared.RequestFeatures;

namespace Repository;

internal sealed class JobSeekerRepository : RepositoryBase<JobSeeker> , IJobSeekerRepository
{
    public JobSeekerRepository(RepositoryContext context) : base(context)
    {
    }

    public async Task<PagedList<JobSeeker>> GetAllJobSeekersAsync(JobSeekerParameters jobSeekerParameters)
    {
        List<JobSeeker> jobSeekers = await FindAll()
            .Include(js => js.Address)
            .Include(js => js.Applications)
            .Include(js => js.Skills)
            .ThenInclude(s => s.Skill)
            .Filter(jobSeekerParameters.Skills)
            .Search(jobSeekerParameters.SearchTerm)
            .Sort(jobSeekerParameters.OrderBy)
            .Skip((jobSeekerParameters.PageNumber - 1) * jobSeekerParameters.PageSize)
            .Take(jobSeekerParameters.PageSize)
            .ToListAsync();

        int count = await FindAll()
            .CountAsync();

        return new PagedList<JobSeeker>(jobSeekers, count, jobSeekerParameters.PageNumber,
            jobSeekerParameters.PageSize);
    }

    public async Task<JobSeeker> GetJobSeekerAsync(Guid id)
    {
        return await FindByCondition(js => js.Id.Equals(id))
          .Include(js => js.User)
            .Include(js => js.Address)
            .Include(js => js.Applications)
            .Include(js => js.Bookmarks)
            .Include(js => js.Skills)
            .ThenInclude(s => s.Skill)
            .SingleAsync();
    }

    public async Task<JobSeeker> GetJobSeekerByUserIdAsync(Guid userId)
    {
        return await FindByCondition(js => js.UserId.Equals(userId))
            .Include(js => js.Address)
            .Include(js => js.Applications)
            .Include(js => js.Skills)
            .ThenInclude(s => s.Skill)
            .SingleAsync();
    }

    public async Task AddJobSeekerAsync(JobSeeker jobSeeker)
    {
       await Create(jobSeeker);
    }

    public void DeleteJobSeeker(JobSeeker jobSeeker)
    {
        Delete(jobSeeker);
    }

    public void UpdateJobSeeker(JobSeeker jobSeeker)
    {
        Update(jobSeeker);
    }
}
