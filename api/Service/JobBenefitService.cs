using Contracts;
using Entities.Enums;
using Entities.Exceptions;
using Entities.Models;
using Service.Contracts;
using Shared.DataTransferObjects.JobBenefitDtos;
using Shared.Mapping;

namespace Service;

public class JobBenefitService : IJobBenefitService
{
    private readonly IRepositoryManager _repository;

    public JobBenefitService(IRepositoryManager repository)
    {
        _repository = repository;
    }
    public async Task<IEnumerable<ViewJobBenefitDto>> GetBenefitsForJobAsync(Guid employerId,Guid jobId)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        IEnumerable<JobBenefit> benefits = await _repository.JobBenefit.GetBenefitsForJobAsync(job);
        return benefits.Select(b => b.ToDto());

    }

    public async Task<IEnumerable<ViewJobBenefitDto>> AddBenefitsForJobAsync(Guid employerId,Guid jobId, List<string> benefits)
    {
        if (!benefits.Any()) throw new BadRequestException("List of benefits is empty");
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        List<JobBenefit> benefitsToAdd = benefits.Select(benefit =>
        {
            JobBenefit jobBenefit = new JobBenefit
            {
              JobId = job.Id,
              Benefit =  (Benefit)Enum.Parse(typeof(Benefit), benefit)
              
            };
            return jobBenefit;
        }).ToList();
        await _repository.JobBenefit.AddBenefitsAsync(benefitsToAdd);
        await _repository.SaveAsync();
        return benefitsToAdd.Select(b => b.ToDto());

    }

    public async Task DeleteBenefitForJobAsync(Guid employerId, Guid jobId, string benefit)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
          JobBenefit jobBenefit = new JobBenefit
          {
            JobId = job.Id,
            Benefit =  (Benefit)Enum.Parse(typeof(Benefit), benefit)
          };
          
        _repository.JobBenefit.DeleteBenefit(jobBenefit);
        await _repository.SaveAsync();
    }
}
