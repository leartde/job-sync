using System.Text.Json;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Attributes;
using Service.Contracts;
using Shared.DataTransferObjects.JobSeekerDtos;
using Shared.RequestFeatures;

namespace Presentation.Controllers;

[ApiController]
[Route("api/jobseekers")]
public class JobSeekersController : ControllerBase
{
    private readonly IServiceManager _service;

    public JobSeekersController(IServiceManager service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllJobSeekers([FromQuery] JobSeekerParameters jobSeekerParameters)
    {
        PagedList<ViewJobSeekerDto> jobSeekers = await _service.JobSeekerService.GetAllJobSeekersAsync(jobSeekerParameters);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(jobSeekers.MetaData);
        return Ok(jobSeekers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobSeeker(Guid id)
    {
        ViewJobSeekerDto jobSeeker = await _service.JobSeekerService.GetJobSeekerAsync(id);
        return Ok(jobSeeker);
    }
    
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetJobSeekerByUserI(Guid id)
    {
      ViewJobSeekerDto jobSeeker = await _service.JobSeekerService.GetJobSeekerByUserIdAsync(id);
      return Ok(jobSeeker);
    }

    [HttpPost]
    public async Task<IActionResult> AddJobSeeker([FromForm]AddJobSeekerDto jobSeekerDto)
    {
       ViewJobSeekerDto jobSeeker =  await _service.JobSeekerService.AddJobSeekerAsync(jobSeekerDto);
        return Ok(jobSeeker);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "JobSeeker")]
    [AuthorizeJobSeeker]
    public async Task<IActionResult> UpdateJobSeeker(Guid id, UpdateJobSeekerDto jobSeekerDto)
    {
        ViewJobSeekerDto jobSeeker = await _service.JobSeekerService.UpdateJobSeekerAsync(id, jobSeekerDto);
        return Ok(jobSeeker);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJobSeeker(Guid id)
    {
        await _service.JobSeekerService.DeleteJobSeekerAsync(id);
        return Ok();
    }

    [HttpDelete("{id}/resume")]
    public async Task<IActionResult> DeleteResume(Guid id)
    {
        await _service.JobSeekerService.DeleteResumeAsync(id);
        return Ok();
    }

   
    
}
