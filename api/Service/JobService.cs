using System.Dynamic;
using CloudinaryDotNet.Actions;
using Contracts;
using Entities.Exceptions;
using Entities.Models;
using Newtonsoft.Json;
using Service.Contracts;
using Shared.DataTransferObjects.JobDtos;
using Shared.DataTransferObjects.SkillDtos;
using Shared.Mapping;
using Shared.RequestFeatures;

namespace Service;

internal sealed class JobService : IJobService
{
    private readonly IRepositoryManager _repository;
    private readonly ILoggerManager _logger;
    private readonly IDataShaper<ViewJobDto> _dataShaper;
    private readonly ICloudinaryManager _cloudinaryManager;

    public JobService(IRepositoryManager repository, ILoggerManager logger, IDataShaper<ViewJobDto> dataShaper, ICloudinaryManager cloudinaryManager )
    {
        _repository = repository;
        _logger = logger;
        _dataShaper = dataShaper;
        _cloudinaryManager = cloudinaryManager;
    }

    public async Task<(IEnumerable<ExpandoObject> jobs, MetaData metaData)> GetAllJobsAsync(JobParameters jobParameters)
    {
        PagedList<Job> jobs = await _repository.Job.GetAllJobsAsync(jobParameters);
        IEnumerable<ExpandoObject> shapedData = 
        _dataShaper.ShapeData(jobs.Select(j => j.ToDto()), jobParameters.Fields);
        
        return (jobs: shapedData, metaData: jobs.MetaData);
    }
    
    public async Task<(IEnumerable<ExpandoObject> jobs, MetaData metaData)> GetJobsForEmployerAsync(Guid employerId, JobParameters jobParameters)
    {
        PagedList<Job> jobs = await _repository.Job.GetJobsForEmployerAsync(employerId, jobParameters);
        IEnumerable<ExpandoObject> shapedData = 
            _dataShaper.ShapeData(jobs.Select(j => j.ToDto()), jobParameters.Fields);
        return (jobs: shapedData, metaData: jobs.MetaData);
    }

    public async Task<ViewJobDto> GetJobForEmployerAsync(Guid employerId,Guid id)
    {
        Job job = await RetrieveJobForEmployerAsync(employerId,id);
        return job.ToDto();
    }

    public async Task<ViewJobDto> AddJobForEmployerAsync(Guid employerId,AddJobDto jobDto)
    {
        Job job = new Job
        {
            EmployerId = employerId
        };
        
        jobDto.ToEntity(job);
        if (jobDto.Image != null)
        {
            ImageUploadResult result = await _cloudinaryManager.ImageUploader.AddPhotoAsync(jobDto.Image);
            job.ImageUrl = result.Url.ToString();
        }
        await _repository.Job.AddJobAsync(job);
        if (jobDto.Skills?.Count > 0 )
        {
            await AddSkillsForJobAsync(job, jobDto.Skills);
        }
        
        await _repository.SaveAsync();
        return job.ToDto(); 
        }
    
    public async Task<ViewJobDto> UpdateJobForEmployerAsync(Guid employerId, Guid id, UpdateJobDto jobDto)
    {
        Job job = await RetrieveJobForEmployerAsync(employerId, id);
        jobDto.ToEntity(job);
        if (jobDto.Image != null)
        {
          if (job.ImageUrl != null) await _cloudinaryManager.DeleteFile(job.ImageUrl);
          ImageUploadResult result = await _cloudinaryManager.ImageUploader.AddPhotoAsync(jobDto.Image);
          job.ImageUrl = result.Url.ToString();
        }
        _repository.Job.UpdateJob(job);
        await _repository.SaveAsync();
        return job.ToDto();
    }

    public async Task DeleteJobImageAsync(Guid employerId, Guid id)
    {
      Job job = await RetrieveJobForEmployerAsync(employerId, id);
      if (job.ImageUrl != null)
      {
        await _cloudinaryManager.DeleteFile(job.ImageUrl);
      }

      job.ImageUrl = null;
       _repository.Job.UpdateJob(job);
       await _repository.SaveAsync();
    }
    

    public async Task DeleteJobForEmployerAsync(Guid employerId,Guid id)
    {
        Job job = await RetrieveJobForEmployerAsync(employerId, id);
        _repository.Job.DeleteJob(job);
        await _repository.SaveAsync();
    }

    private async Task<Job> RetrieveJobForEmployerAsync(Guid employerId, Guid id)
    {
        
            Job job = await _repository.Job.GetJobForEmployerAsync(employerId, id);
            if (job is null) throw new NotFoundException(nameof(Job), id);
            return job;

    }
    
        private async Task AddSkillsForJobAsync(Job job, List<string> skillNames)
        {
          List<JobSkill> jobSkills =[];
            List<Skill> newSkills = [];
            foreach (string skillName in skillNames)
            {
                Skill? skill = await _repository.Skill.GetSkillByNameAsync(skillName);
                if(skill is null)
                {
                    Skill newSkill = new Skill
                    {
                      Id = Guid.NewGuid(),
                      Name = skillName
                    };
                    
                    newSkills.Add(newSkill);
                    jobSkills.Add(new JobSkill{JobsId = job.Id,SkillsId = newSkill.Id});
                }
                else
                {
                    jobSkills.Add(new JobSkill{JobsId = job.Id,SkillsId = skill.Id});
                }
                
            }
            if (newSkills.Count > 0)
            {
                await _repository.Skill.AddSkillsAsync(newSkills);
            }
            await _repository.JobSkill.AddJobSkillsAsync(jobSkills);
            await _repository.SaveAsync();

        }
        
}
