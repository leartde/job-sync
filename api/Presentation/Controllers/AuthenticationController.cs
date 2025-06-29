using System.Text.Json;
using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.UserDtos;
using Shared.RequestFeatures;

namespace Presentation.Controllers;

[Route("api/authentication")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IServiceManager _service;

    public AuthenticationController(IServiceManager service)
    {
        _service = service;
    }
    
    
    [HttpGet("users")]
    [Authorize(Roles="Admin")]
    public async Task<IActionResult> GetUsers([FromQuery]AppUserParameters parameters)
    {
        PagedList<ViewUserDto> users = await _service.AuthenticationService.GetAllUsersAsync(parameters);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(users.MetaData);

        return Ok(users);
    }
    
    [HttpGet("users/{id}")]
    [Authorize(Roles="Admin")]
    public async Task<IActionResult> GetUser(Guid id)
    {
      ViewUserDto user = await _service.AuthenticationService.GetUserAsync(id);
      return Ok(user);
    }


    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
      await _service.AuthenticationService.DeleteUserAsync(id);
      return Ok();
    }
    
    [HttpPost("register/jobseeker")]
    public async Task<IActionResult> RegisterJobSeeker([FromForm] RegisterJobSeekerDto userDto)
    {
        
        if (userDto.JobSeeker is null)
        {
            throw new BadRequestException("Job Seeker details are missing");
        }
         (IdentityResult result,AppUser user) = await _service.AuthenticationService.RegisterUserAsync(userDto);
        if (result.Succeeded)
        {
            userDto.JobSeeker.UserId = user.Id;
            await _service.JobSeekerService.AddJobSeekerAsync(userDto.JobSeeker);
            return Ok();
        }
        foreach (IdentityError error in result.Errors)
        {
            ModelState.TryAddModelError(error.Code, error.Description);
        }
        return BadRequest(ModelState);
    }
    
    [HttpPost("register/employer")]
    public async Task<IActionResult> RegisterEmployer([FromForm] RegisterEmployerDto userDto)
    {
        (IdentityResult result, AppUser user) = await _service.AuthenticationService.RegisterUserAsync(userDto);
        if (result.Succeeded)
        {
            if (userDto.Employer is null)
            {
                throw new BadRequestException("Employer details are missing");
            }

            userDto.Employer.UserId = user.Id;
            await _service.EmployerService.AddEmployerAsync(userDto.Employer);
            return Ok();
        }

        foreach (IdentityError error in result.Errors)
        {
            ModelState.TryAddModelError(error.Code, error.Description);
        }

        return BadRequest(ModelState);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Authenticate([FromBody] LoginUserDto userDto,bool isPersistent)
    {
        await _service.AuthenticationService.ValidateUserAsync(userDto);
        TokenDto tokenDto = await _service.AuthenticationService.CreateToken(isPersistent);
        return Ok(tokenDto);
    }

    [HttpGet("me")]
    public IActionResult GetTokens()
    {
        TokenDto tokenDto =  _service.AuthenticationService.GetToken();
        return Ok(tokenDto);
    }
    
    [HttpPost("logout")]
    public IActionResult Logout()
    {
         _service.AuthenticationService.ClearCookies();
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(bool isPersistent)
    {
        TokenDto tokenDtoToReturn
          = await _service.AuthenticationService.RefreshToken(isPersistent);
        return Ok(tokenDtoToReturn);
    }
}
