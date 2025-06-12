using CloudinaryDotNet.Actions;
using Contracts;
using Entities.Exceptions;
using Entities.Models;
using Service.Contracts;
using Shared.DataTransferObjects.JobSeekerDtos;
using Shared.Mapping;
using Shared.RequestFeatures;

namespace Service;

internal sealed class JobSeekerService : IJobSeekerService
{
    private readonly IRepositoryManager _repository;
    private readonly ILoggerManager _logger;
    private readonly ICloudinaryManager _cloudinaryManager;


    public JobSeekerService(IRepositoryManager repository, ILoggerManager logger, ICloudinaryManager cloudinaryManager)
    {
        _repository = repository;
        _logger = logger;
        _cloudinaryManager = cloudinaryManager;
    }

    public async Task<PagedList<ViewJobSeekerDto>> GetAllJobSeekersAsync(JobSeekerParameters jobSeekerParameters)
    {
        PagedList<JobSeeker> jobSeekers = await _repository.JobSeeker.GetAllJobSeekersAsync(jobSeekerParameters);
        return new PagedList<ViewJobSeekerDto>(jobSeekers.Select(js => js.ToDto()).ToList(),
            jobSeekers.MetaData.TotalCount, jobSeekerParameters.PageNumber,
            jobSeekerParameters.PageSize);
    }

    public async Task<ViewJobSeekerDto> GetJobSeekerAsync(Guid id)
    {
        JobSeeker jobSeeker = await RetrieveJobSeekerAsync(id);
        return jobSeeker.ToDto();
    }


    public async Task<ViewJobSeekerDto> AddJobSeekerAsync(AddJobSeekerDto jobSeekerDto)
    {
      
        JobSeeker jobSeeker = new JobSeeker();
        
            jobSeekerDto.ToEntity(jobSeeker);
            if (jobSeekerDto.UserId != null)
            {
              jobSeeker.UserId = jobSeekerDto.UserId ?? Guid.Empty;
            }
            if (jobSeekerDto.Resume != null)
            {
                RawUploadResult result = await _cloudinaryManager.RawUploader.AddFileAsync(jobSeekerDto.Resume);
                jobSeeker.ResumeLink = result.Url.ToString();
                jobSeeker.ResumeName = result.OriginalFilename;
            }
            await _repository.JobSeeker.AddJobSeekerAsync(jobSeeker);
        
            if (jobSeekerDto.Skills is { Count: > 0 })
            {
                await AddSkillsForJobSeekerAsync(jobSeeker, jobSeekerDto.Skills);
            }

            await _repository.SaveAsync();
        return jobSeeker.ToDto();
    }
    
    public async Task DeleteJobSeekerAsync(Guid id)
    {
        JobSeeker jobSeeker = await RetrieveJobSeekerAsync(id);
        _repository.JobSeeker.DeleteJobSeeker(jobSeeker);
        await _repository.SaveAsync();
    }

    public async Task<ViewJobSeekerDto> UpdateJobSeekerAsync(Guid id, UpdateJobSeekerDto jobSeekerDto)
    {
        JobSeeker jobSeeker = await RetrieveJobSeekerAsync(id);
        jobSeekerDto.ToEntity(jobSeeker);
        if (jobSeekerDto.Resume != null)
        {
            if (jobSeeker.ResumeLink != null) await _cloudinaryManager.DeleteFile(jobSeeker.ResumeLink);
            RawUploadResult result = await _cloudinaryManager.RawUploader.AddFileAsync(jobSeekerDto.Resume);
            jobSeeker.ResumeLink = result.Url.ToString();
            jobSeeker.ResumeName = result.OriginalFilename;
        }
        _repository.JobSeeker.UpdateJobSeeker(jobSeeker);
        await _repository.SaveAsync();
        return jobSeeker.ToDto();
    }

    private async Task<JobSeeker> RetrieveJobSeekerAsync(Guid id)
    {
        JobSeeker? jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(id);
        if (jobSeeker is null) throw new NotFoundException(nameof(jobSeeker), id);
        return jobSeeker;
    }

    public async Task DeleteResumeAsync(Guid id)
    {
        JobSeeker jobSeeker = await RetrieveJobSeekerAsync(id);
       DeletionResult result =  await _cloudinaryManager.DeleteFile(jobSeeker.ResumeLink ?? "");
       if (result.Error != null) throw new BadRequestException("Resume deletion failed");
       jobSeeker.ResumeLink = null;
       jobSeeker.ResumeName = null;
       _repository.JobSeeker.UpdateJobSeeker(jobSeeker);
       await _repository.SaveAsync();
    }

    private async Task AddSkillsForJobSeekerAsync(JobSeeker jobSeeker, List<string> skillNames)
    {
        List<JobSeekerSkill> jobSeekerSkills = [];
        List<Skill> newSkills = [];
        foreach (string skillName in skillNames)
        {
            Skill? skill = await _repository.Skill.GetSkillByNameAsync(skillName);
            if (skill == null)
            {
                Skill newSkill = new Skill
                {
                    Id = Guid.NewGuid(),
                    Name = skillName
                };
                newSkills.Add(newSkill);
                jobSeekerSkills.Add(new JobSeekerSkill
                {
                    JobSeekersId = jobSeeker.Id,
                    SkillsId = newSkill.Id
                });
            }
            else
            {
                jobSeekerSkills.Add(new JobSeekerSkill
                {
                    JobSeekersId = jobSeeker.Id,
                    SkillsId = skill.Id
                });
            }
        }

        if (newSkills.Count > 0) await _repository.Skill.AddSkillsAsync(newSkills);
        await _repository.JobSeekerSkill.AddJobSeekerSkillsAsync(jobSeekerSkills);
        await _repository.SaveAsync();
    }
}
