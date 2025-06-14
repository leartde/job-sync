using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Attributes;
using Service.Contracts;
using Shared.DataTransferObjects.AddressDtos;

namespace Presentation.Controllers;

[Route("api/employers/{employerId}/jobs/{jobId}/address")]
[ApiController]
[Authorize(Roles="Employer")]
[AuthorizeEmployer]

public class JobAddressesController : ControllerBase
{
    private readonly IServiceManager _service;

    public JobAddressesController(IServiceManager service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAddress(Guid employerId, Guid jobId)
    {
        ViewAddressDto addresses = await _service.AddressService.GetAddressForJobAsync(employerId,jobId);
        return Ok(addresses);
    }
    [HttpPost]
    [Authorize(Roles="Employer")]
    [AuthorizeEmployer]
    public async Task<IActionResult> AddAddress(Guid employerId, Guid jobId,[FromForm]AddAddressDto addressDto)
    {
        ViewAddressDto address = await _service.AddressService.AddAddressForJobAsync(employerId,jobId,addressDto);
        return Ok(address);
    }
    
    [HttpPut]
    [Authorize(Roles="Employer")]
    [AuthorizeEmployer]
    public async Task<IActionResult> UpdateAddress(Guid employerId, Guid jobId,[FromForm] UpdateAddressDto addressDto)
    {
        ViewAddressDto address = await _service.AddressService.UpdateAddressForJobAsync(employerId,jobId, addressDto);
        return Ok(address);
    }
    
    [HttpDelete]
    [Authorize(Roles="Employer")]
    [AuthorizeEmployer]
    public async Task<IActionResult> DeleteAddress(Guid employerId, Guid jobId)
    {
        await _service.AddressService.DeleteAddressForJobAsync( employerId,jobId);
        return Ok();
    }
    
}
