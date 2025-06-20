using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Extensions;
using Shared.RequestFeatures;

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
        )
        .Include(a => a.Job)
        .ThenInclude(j => j!.Employer)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.User)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.Skills)
        .ThenInclude(s => s.Skill)

          .SingleAsync();
    }

    public async Task<PagedList<JobApplication>> GetApplicationsForJobSeekerAsync(JobSeeker jobSeeker, JobApplicationParameters parameters)
    {
      List<JobApplication> jobApplications = await FindByCondition(a => a.JobSeekerId.Equals(jobSeeker.Id))
        .Include(a => a.Job)
        .ThenInclude(j => j!.Employer)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.User)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.Skills)
        .ThenInclude(s => s.Skill)
        .Filter(parameters.HasResume)
        .Search(parameters.SearchTerm)
        .Skip((parameters.PageNumber - 1) * parameters.PageSize)
        .Take(parameters.PageSize)
        .Sort(parameters.OrderBy)
        .ToListAsync();

      int count = await FindByCondition(a => a.JobSeekerId.Equals(jobSeeker.Id))
        .Filter(parameters.HasResume)
        .Search(parameters.SearchTerm)
        .CountAsync();

      return new PagedList<JobApplication>(jobApplications, count, parameters.PageNumber, parameters.PageSize);


    }

    public async Task<PagedList<JobApplication>> GetApplicationsForJobAsync(Job job, JobApplicationParameters parameters)
    {
      List<JobApplication> jobApplications = await FindByCondition(a => a.JobId.Equals(job.Id))
        .Include(a => a.Job)
        .ThenInclude(j => j!.Employer)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.User)
        .Include(a => a.JobSeeker)
        .ThenInclude(js => js!.Skills)
        .Filter(parameters.HasResume)
        .Search(parameters.SearchTerm)
        .Skip((parameters.PageNumber - 1) * parameters.PageSize)
        .Take(parameters.PageSize)
        .Sort(parameters.OrderBy)
        .ToListAsync();

      int count = await FindByCondition(a => a.JobId.Equals(job.Id))
        .Filter(parameters.HasResume)
        .Search(parameters.SearchTerm)
        .CountAsync();

      return new PagedList<JobApplication>(jobApplications, count, parameters.PageNumber, parameters.PageSize);
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
