using Entities.Enums;
using Entities.Models;
using Shared.DataTransferObjects.JobDtos;

namespace Shared.Mapping;

public static class JobMapping
{
  public static ViewJobDto ToDto(this Job entity)
  {
    return new ViewJobDto
    {
      Id = entity.Id,
      Title = entity.Title,
      Address = entity.Address != null
        ? $"{entity.Address.Street}, {entity.Address.City}, {entity.Address.Region ?? entity.Address.State}"
          + $"{entity.Address.Country}, {entity.Address.ZipCode}"
        : "Remote",
      Pay = $"${entity.HourlyPay}/hour",
      Status = entity.Status.ToString(),
      HourlyPay = entity.HourlyPay,
      Description = entity.Description,
      Type = entity.Type,
      ImageUrl = entity.ImageUrl,
      IsTakingApplications = entity.IsTakingApplications,
      HasMultipleSpots = entity.HasMultipleSpots,
      CreatedAt = entity.CreatedAt,
      Employer = entity.Employer?.Name ?? string.Empty,
      EmployerId = entity.EmployerId,
      Skills = entity.Skills.Select(s => s.Skill?.Name!).ToList(),
      Benefits = entity.Benefits.Select(b => b.Benefit.ToString()).ToList(),
      City = entity.Address?.City

    };

  }

  public static void ToEntity(this JobDto dto, Job entity)
  {
    entity.Title = dto.Title;
    entity.HourlyPay = dto.HourlyPay;
    entity.Description = dto.Description;
    entity.Type = dto.Type;
    entity.IsTakingApplications = dto.IsTakingApplications;
    entity.HasMultipleSpots = dto.HasMultipleSpots;
    List<JobBenefit> jobBenefits = [];
    jobBenefits.AddRange(dto.Benefits
      .Select(benefit => new JobBenefit
      {
        JobId = entity.Id,
        Benefit = (Benefit)Enum.Parse(typeof(Benefit), benefit)
      }));
    entity.Benefits = jobBenefits;
    if (dto is AddJobDto { Address: not null } addJobDto)
    {
      Address address = new Address();
      addJobDto.Address.ToEntity(address);
      entity.Address = address;
    }
  }
}
