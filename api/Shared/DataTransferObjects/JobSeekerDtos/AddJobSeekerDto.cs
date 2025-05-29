using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.AddressDtos;
using Shared.DataTransferObjects.SkillDtos;

namespace Shared.DataTransferObjects.JobSeekerDtos;

public class AddJobSeekerDto : JobSeekerDto
{
    public IFormFile? Resume { get; set; }
    public List<String>? Skills { get; set; }
    public AddAddressDto? Address { get; set; }

}