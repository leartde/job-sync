using System.Text.Json;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.JobApplicationDtos;
using Shared.RequestFeatures;

namespace Presentation.Controllers;
[Route("api/jobapplications")]
[ApiController]

public class JobApplicationController : ControllerBase
{
    private readonly IServiceManager _service;

    public JobApplicationController(IServiceManager service)
    {
        _service = service;
    }

    [HttpGet("{jobId}/{jobSeekerId}")]
    public async Task<IActionResult> GetApplicationAsync(Guid jobId, Guid jobSeekerId)
    {
        ViewJobApplicationDto application = await _service.JobApplicationService.GetApplicationAsync(jobId, jobSeekerId);
        return Ok(application);
    }

    [HttpGet("/api/jobseekers/{jobSeekerId}/applications")]
    public async Task<IActionResult> GetApplicationsForJobSeeker(Guid jobSeekerId,[FromQuery]JobApplicationParameters parameters)
    {
        PagedList<ViewJobApplicationDto> applications =
            await _service.JobApplicationService.GetApplicationsForJobSeekerAsync(jobSeekerId, parameters);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(applications.MetaData);
        return Ok(applications);
    }
    
    
    [HttpGet("/api/employers/{employerId}/jobs/{jobId}/applications")]
    public async Task<IActionResult> GetApplicationsForJob(Guid employerId, Guid jobId,[FromQuery]JobApplicationParameters parameters)
    {
      PagedList<ViewJobApplicationDto> applications =
            await _service.JobApplicationService.GetApplicationsForJobAsync(employerId,jobId, parameters);
      Response.Headers["X-Pagination"] = JsonSerializer.Serialize(applications.MetaData);
        return Ok(applications);
    }

    [HttpPost("/api/jobseekers/{jobSeekerId}/applications/{jobId}")]
    public async Task<IActionResult> AddApplication(Guid jobSeekerId, Guid jobId)
    {
        ViewJobApplicationDto application = await _service.JobApplicationService.AddApplicationAsync(jobSeekerId,jobId);
        return Ok(application);
    }

    [HttpPut("/api/employers/{employerId}/jobs/{jobId}/applications/{jobSeekerId}")]
    public async Task<IActionResult> UpdateApplication(UpdateJobApplicationDTO jobApplicationDto,Guid employerId, Guid jobId, Guid jobSeekerId)
    {
        ViewJobApplicationDto jobApplication = await _service.JobApplicationService
            .UpdateApplicationAsync(jobApplicationDto, employerId, jobId, jobSeekerId);
        return Ok(jobApplication);
    }

    [HttpDelete("/api/jobseekers/{jobSeekerId}/applications/{jobId}")]
    public async Task<IActionResult> DeleteApplication(Guid jobId, Guid jobSeekerId)
    {
        await _service.JobApplicationService.DeleteApplicationAsync(jobId, jobSeekerId);
        return Ok();
    }
}
