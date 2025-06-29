using Entities.Models;
using Shared.DataTransferObjects.UserDtos;

namespace Shared.Mapping;

public static class UserMapping
{
     public static ViewUserDto ToDto(this AppUser entity)
     {
         return new ViewUserDto
         {
             Id = entity.Id,
             Email = entity.Email ?? string.Empty,
             CreatedAt = entity.CreatedAt
         };
     }

     public static void ToEntity(this UserDto dto, AppUser entity)
     {
         entity.Email = dto.Email;
         entity.UserName = dto.Email;
     }
}
