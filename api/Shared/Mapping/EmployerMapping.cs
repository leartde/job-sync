using Entities.Enums;
using Entities.Exceptions;
using Entities.Models;
using Shared.DataTransferObjects.EmployerDtos;

namespace Shared.Mapping;

public static class EmployerMapping
{
    public static ViewEmployerDto ToDto(this Employer entity)
    {
        return new ViewEmployerDto
        {
            Id = entity.Id,
            UserId = entity.UserId,
            Name = entity.Name,
            Email = entity.Email,
            Description = entity.Description,
            Headquarters = entity.Headquarters,
            Website = entity.Website,
            Industry = entity.IndustryString,
            Founded = entity.Founded,
            CreatedAt = entity.CreatedAt,
            Phone = entity.Phone,
            SecondaryPhone = entity.SecondaryPhone,
            PhotoUrl = entity.PhotoUrl
        };
    }

    public static void ToEntity(this EmployerDto dto, Employer entity )
    {
        entity.Name = dto.Name;
        entity.Email = dto.Email;
        entity.Description = dto.Description;
        entity.Headquarters = dto.Headquarters;
        entity.Website = dto.Website;
        entity.Industry = (Industry)Enum.Parse(typeof(Industry), dto.Industry ); 
        entity.Founded = dto.Founded;
        entity.Phone = dto.Phone;
        entity.SecondaryPhone = dto.SecondaryPhone;
        
    }
}
