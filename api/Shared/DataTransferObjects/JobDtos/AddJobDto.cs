using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.AddressDtos;
using Shared.DataTransferObjects.SkillDtos;

namespace Shared.DataTransferObjects.JobDtos;

public class AddJobDto : JobDto
{
    public IFormFile? Image { get; set; }
    public AddAddressDto? Address { get; set; }
    public List<string>? Skills { get; set; }
}
