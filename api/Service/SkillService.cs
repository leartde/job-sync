using Contracts;
using Entities.Exceptions;
using Entities.Models;
using Service.Contracts;
using Shared.DataTransferObjects.SkillDtos;
using Shared.Mapping;

namespace Service;

public class SkillService : ISkillService
{
    private readonly IRepositoryManager _repository;

    public SkillService(IRepositoryManager repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ViewSkillDto>> GetSkillsForJobAsync(Guid employerId, Guid jobId)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        return job.Skills.Select(s => s.Skill!.ToDto());
    }

    public async Task<IEnumerable<ViewSkillDto>> GetSkillsForJobSeekerAsync(Guid jobSeekerId)
    {
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        return jobSeeker.Skills.Select(s => s.Skill!.ToDto());
    }

    public async Task<IEnumerable<ViewSkillDto>> AddSkillsForJobAsync(Guid employerId, Guid jobId, List<string> skills)
    {
      List<JobSkill> jobSkills = [];
      List<Skill> newSkills = [];
      List<Skill> existingSkills = [];
      foreach (string skillName in skills)
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
          jobSkills.Add(new JobSkill
          {
            JobsId = jobId,
            SkillsId = newSkill.Id
          });
        }
        else
        {
          existingSkills.Add(skill);
          jobSkills.Add(new JobSkill()
          {
            JobsId = jobId,            SkillsId = skill.Id
          });
        }

        if (newSkills.Count > 0) await _repository.Skill.AddSkillsAsync(newSkills);
        await _repository.JobSkill.AddJobSkillsAsync(jobSkills);
      }

      await _repository.SaveAsync();
      return newSkills.Concat(existingSkills).Select(s => s.ToDto());
    }

    public async Task<IEnumerable<ViewSkillDto>> AddSkillsForJobSeekerAsync(Guid jobSeekerId, List<string> skills)
    {
        List<JobSeekerSkill> jobSeekerSkills = [];
        List<Skill> newSkills = [];
        List<Skill> existingSkills = [];
        foreach (string skillName in skills)
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
                    JobSeekersId = jobSeekerId,
                    SkillsId = newSkill.Id
                });
            }
            else
            {
                existingSkills.Add(skill);
                jobSeekerSkills.Add(new JobSeekerSkill
                {
                    JobSeekersId = jobSeekerId,
                    SkillsId = skill.Id
                });
            }

            if (newSkills.Count > 0) await _repository.Skill.AddSkillsAsync(newSkills);
            await _repository.JobSeekerSkill.AddJobSeekerSkillsAsync(jobSeekerSkills);
        }

        await _repository.SaveAsync();
        return newSkills.Concat(existingSkills).Select(s => s.ToDto());
    }


public async Task DeleteSkillForJobAsync(Guid employerId, Guid jobId, Guid skillId)
{
  Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
  if (job is null) throw new NotFoundException(typeof(Job).ToString(), jobId);
  JobSkill jobSkill = await _repository.JobSkill.GetJobSkillAsync(job.Id, skillId);
  _repository.JobSkill.DeleteJobSkill(jobSkill);
  await _repository.SaveAsync();
}

    public async Task DeleteSkillForJobSeekerAsync(Guid jobSeekerId, Guid skillId)
    {
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        if (jobSeeker is null) throw new NotFoundException(typeof(JobSeeker).ToString(), jobSeekerId);
        JobSeekerSkill jsSkill = await _repository.JobSeekerSkill.GetJobSeekerSkillAsync(jobSeekerId,skillId);
        _repository.JobSeekerSkill.DeleteJobSeekerSkill(jsSkill);
        await _repository.SaveAsync();

    }

    public async Task DeleteSkillsForJobAsync(Guid employerId, Guid jobId, List<Guid> skillIds)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        if (job is null) throw new NotFoundException(typeof(Job).ToString(), jobId);
        List<JobSkill> jobSkillsToDelete = skillIds
            .Select(skillId => new JobSkill { JobsId = job.Id, SkillsId = skillId })
            .ToList();
        _repository.JobSkill.DeleteJobSkills(jobSkillsToDelete);
        await _repository.SaveAsync();
    }

    public async Task DeleteSkillsForJobSeekerAsync(Guid jobSeekerId, List<Guid> skillIds)
    {
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        if (jobSeeker is null) throw new NotFoundException(typeof(JobSeeker).ToString(), jobSeekerId);
        List<JobSeekerSkill> jobSeekerSkillsToDelete = skillIds
            .Select(skillId => new JobSeekerSkill { JobSeekersId = jobSeeker.Id, SkillsId = skillId })
            .ToList();
      _repository.JobSeekerSkill.DeleteJobSeekerSkills(jobSeekerSkillsToDelete);
      await _repository.SaveAsync();

    }
}
