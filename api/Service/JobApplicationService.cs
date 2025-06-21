using Contracts;
using Entities.Models;
using Scriban;
using Service.Contracts;
using Shared.DataTransferObjects.JobApplicationDtos;
using Shared.Mapping;
using Shared.RequestFeatures;

namespace Service;

public class JobApplicationService : IJobApplicationService
{
    private readonly IRepositoryManager _repository;
    private readonly IMailService _mailService;

    private static readonly Dictionary<int, (string Status, string Message)> ApplicationInfo = new()
    {
      { 1, ("Reviewed", "The employer has reviewed your application.") },
      { 2, ("Interview", "Congratulations, the employer has invited you to an interview!") },
      { 3, ("Hired", "Congratulations, the employer has decided to hire you for the job!") },
      { 4, ("Rejected", "Unfortunately, the employer has decided to reject your application.") }
    };

    
    



    public JobApplicationService(IRepositoryManager repository, IMailService mailService)
    {
        _repository = repository;
        _mailService = mailService;
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
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        JobApplication jobApplication = await _repository.JobApplication
            .GetJobApplication(job.Id, jobSeekerId);
        jobApplicationDto.ToEntity(jobApplication);
        _repository.JobApplication.UpdateApplication(jobApplication);
        await _repository.SaveAsync();
        if (jobSeeker.User?.Email != null)
        {
          await
            SendApplicationStatusEmail(jobSeeker.User.Email,
   "Job Application Update",jobSeeker.FirstName,job.Title, (int)jobApplication.Status);

        }
        return jobApplication.ToDto();
    }

    private async Task SendApplicationStatusEmail(string emailTo, string subject, string name, string jobTitle, int status)
    {
      if (status is < 1 or > 4 ) return;
      string baseDir = AppContext.BaseDirectory;
      string templatePath = Path.Combine(baseDir, "MailService", "Views", "ApplicationResponse.html");
      string templateContent = await File.ReadAllTextAsync(templatePath);
      Template template = Template.Parse(templateContent);

      Dictionary<string, object> model = new()
      {
        ["name"] = name,
        ["jobTitle"] = jobTitle,
        ["applicationStatus"] = ApplicationInfo[status].Status,
        ["statusMessage"] = ApplicationInfo[status].Message
      };
      
      string renderedTemplate = await template.RenderAsync(model);
      await _mailService.SendEmailAsync(emailTo, subject, renderedTemplate);

    }


    public async Task DeleteApplicationAsync(Guid jobId, Guid jobSeekerId)
    {
        JobApplication jobApplication = await _repository.JobApplication
            .GetJobApplication(jobId, jobSeekerId);
        _repository.JobApplication.DeleteApplication(jobApplication);
        await _repository.SaveAsync();
    }

    

    
}
