using Contracts;
using Entities.Models;
using Service.Contracts;
using Shared.DataTransferObjects.JobApplicationDtos;
using Shared.Mapping;
using Shared.RequestFeatures;

namespace Service;

public class JobApplicationService : IJobApplicationService
{
    private readonly IRepositoryManager _repository;

    public JobApplicationService(IRepositoryManager repository)
    {
        _repository = repository;
    }

    public async Task<ViewJobApplicationDto> GetApplicationAsync(Guid jobId, Guid jobSeekerId)
    {
        JobApplication jobApplication = await _repository.JobApplication.GetJobApplication(jobId, jobSeekerId);
        return jobApplication.ToDto();
    }

    public async Task<PagedList<ViewJobApplicationDto>> GetApplicationsForJobSeekerAsync(Guid jobSeekerId, JobApplicationParameters parameters)
    {
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        if (jobSeeker is null) throw new NullReferenceException();
        PagedList<JobApplication> applications =
            await _repository.JobApplication.GetApplicationsForJobSeekerAsync(jobSeeker, parameters);
        List<ViewJobApplicationDto> applicationDtos = applications.Select(a => a.ToDto()).ToList();
        return new PagedList<ViewJobApplicationDto>(applicationDtos, applications.MetaData.TotalCount,
          parameters.PageNumber, parameters.PageSize);
    }
    

    public async Task<PagedList<ViewJobApplicationDto>> GetApplicationsForJobAsync(Guid employerId, Guid jobId, JobApplicationParameters parameters)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        if (job is null) throw new NullReferenceException();
        PagedList<JobApplication> applications =
          await _repository.JobApplication.GetApplicationsForJobAsync(job, parameters);
        List<ViewJobApplicationDto> applicationDtos = applications.Select(a => a.ToDto()).ToList();
        return new PagedList<ViewJobApplicationDto>(applicationDtos, applications.MetaData.TotalCount,
          parameters.PageNumber, parameters.PageSize);
    }
    

    public async Task<ViewJobApplicationDto> AddApplicationAsync(Guid jobSeekerId, Guid jobId)
    {
        JobApplication jobApplication = new JobApplication
        {
            JobSeekerId = jobSeekerId,
            JobId =  jobId
        };
        await _repository.JobApplication.AddApplicationAsync(jobApplication);
        await _repository.SaveAsync();
        return jobApplication.ToDto();
    }

    public async Task<ViewJobApplicationDto> UpdateApplicationAsync(UpdateJobApplicationDTO jobApplicationDto,
        Guid employerId, Guid jobId, Guid jobSeekerId)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        JobApplication jobApplication = await _repository.JobApplication
            .GetJobApplication(job.Id, jobSeekerId);
        jobApplicationDto.ToEntity(jobApplication);
        _repository.JobApplication.UpdateApplication(jobApplication);
        await _repository.SaveAsync();
        return jobApplication.ToDto();
    }


    public async Task DeleteApplicationAsync(Guid jobId, Guid jobSeekerId)
    {
        JobApplication jobApplication = await _repository.JobApplication
            .GetJobApplication(jobId, jobSeekerId);
        _repository.JobApplication.DeleteApplication(jobApplication);
        await _repository.SaveAsync();
    }

    

    
}
