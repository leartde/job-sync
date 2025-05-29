using System.Dynamic;
using System.Text.Json;
using Entities.Models;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.JobDtos;
using Shared.Mapping;
using Shared.RequestFeatures;
using Validation.Validators;

namespace Presentation.Controllers;

[Route("api/employers/{employerId}/jobs")]
[ApiController]
public class JobsController : ControllerBase
{
    private readonly IServiceManager _service;
    public JobsController(IServiceManager service)
    {
        _service = service;
    }

    [HttpGet("/api/jobs")]
    public async Task<IActionResult> GetAllJobs([FromQuery] JobParameters jobParameters)
    {
        (IEnumerable<ExpandoObject> jobs, MetaData metaData) pagedResult =
            await _service.JobService.GetAllJobsAsync(jobParameters);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(pagedResult.metaData);
        return Ok(pagedResult.jobs);
    }

    [HttpGet]
    public async Task<IActionResult> GetJobsForEmployer(Guid employerId,[FromQuery] JobParameters jobParameters)
    {
        (IEnumerable<ExpandoObject> jobs, MetaData metaData) pagedResult = await _service.JobService.GetJobsForEmployerAsync(employerId,jobParameters);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(pagedResult.metaData);
        return Ok(pagedResult.jobs);
        
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobForEmployer(Guid employerId, Guid id)
    {
        ViewJobDto job = await _service.JobService.GetJobForEmployerAsync(employerId, id);
        return Ok(job);
    }

    [HttpPost]
    public async Task<IActionResult> AddJob(Guid employerId,[FromForm]AddJobDto jobDto)
    {
        ViewJobDto job = await _service.JobService.AddJobForEmployerAsync(employerId,jobDto);
        return Ok(job);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJob(Guid employerId, Guid id, [FromForm]UpdateJobDto jobDto)
    {
        ViewJobDto job = await _service.JobService.UpdateJobForEmployerAsync(employerId, id, jobDto);
        return Ok(job);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJobForEmployer(Guid employerId,Guid id)
    {
        await _service.JobService.DeleteJobForEmployerAsync(employerId,id);
        return Ok();
    }
}