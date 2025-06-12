using Entities.Models;
using Shared.DataTransferObjects.JobApplicationDtos;

namespace Shared.Mapping;

public static class JobApplicationMapping
{
    public static ViewJobApplicationDto ToDto(this JobApplication entity)
    {
        return new ViewJobApplicationDto
        {
           JobId = entity.JobId,
            JobSeekerId = entity.JobSeekerId,
            Employer = entity.Job?.Employer?.Name ?? string.Empty,
            EmployerId = entity.Job?.EmployerId ?? Guid.Empty,
            JobTitle = entity.Job?.Title ?? string.Empty,
            Candidate = $"{entity.JobSeeker?.FirstName}" +
                        $" {entity.JobSeeker?.MiddleName ?? string.Empty}" +
                        $" {entity.JobSeeker?.LastName} ",
            Email = entity.JobSeeker?.User?.Email ?? "",
            Phone = entity.JobSeeker?.Phone ?? "",
            ResumeLink = entity.JobSeeker?.ResumeLink ?? "",
            Skills = entity.JobSeeker?.Skills.Select(s => s.Skill?.Name ?? ""),
            Status = entity.Status,
            StatusString = entity.Status.ToString(),
            CreatedAt = entity.CreatedAt
            
        };
    }

    public static void ToEntity(this JobApplicationDto dto, JobApplication entity)
    {
        entity.Status = dto.Status;
    }
    }
