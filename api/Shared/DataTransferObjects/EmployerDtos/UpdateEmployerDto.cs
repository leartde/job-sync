using Microsoft.AspNetCore.Http;

namespace Shared.DataTransferObjects.EmployerDtos;

public class UpdateEmployerDto : EmployerDto
{
    public IFormFile? Photo { get; set; }
}
