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
                        $"{entity.JobSeeker?.MiddleName ?? string.Empty}" +
                        $"{entity.JobSeeker?.LastName} ",
            StatusString = entity.Status.ToString(),
            CreatedAt = entity.CreatedAt
            
        };
    }

    public static void ToEntity(this JobApplicationDto dto, JobApplication entity)
    {
        entity.JobId = dto.JobId;
        entity.Status = dto.Status;

    }
    
    }