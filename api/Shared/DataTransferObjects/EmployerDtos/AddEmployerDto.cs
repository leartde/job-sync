using Microsoft.AspNetCore.Http;

namespace Shared.DataTransferObjects.EmployerDtos;

public class AddEmployerDto : EmployerDto
{
  public IFormFile? Photo { get; set; } 
}
