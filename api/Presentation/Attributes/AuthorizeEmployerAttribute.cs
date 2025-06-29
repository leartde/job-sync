using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Presentation.Attributes;

public class AuthorizeEmployerAttribute : AuthorizeAttribute, IAuthorizationFilter
{
  public void OnAuthorization(AuthorizationFilterContext context)
  {
    if (context.HttpContext.User.Identity is { IsAuthenticated: false }) return;
    string? role = context.HttpContext.User.Claims.FirstOrDefault(
      c => c.Type == ClaimTypes.Role
    )?.Value;
    if (role is not null && role.Equals("Admin")) return;
  

    string? employerId = context.HttpContext.Request.RouteValues.TryGetValue("employerId", out object? val1)
      ? val1?.ToString()
      : context.HttpContext.Request.RouteValues.TryGetValue("id", out object? val2)
        ? val2?.ToString()
        : null;

    if (employerId is null)
    {
      context.Result = new BadRequestObjectResult("Employer ID is required (as 'employerId' or 'id' in route).");
      return;
    }

    string? userId = context.HttpContext.User.Claims
      .FirstOrDefault(c => c.Type == "id")?.Value;

    if (userId is null || userId != employerId)
    {
      context.Result = new ForbidResult();
    }
  }
}
