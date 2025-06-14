using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Presentation.Attributes;

public class AuthorizeJobSeekerAttribute : AuthorizeAttribute, IAuthorizationFilter
{
  public void OnAuthorization(AuthorizationFilterContext context)
  {
    if (context.HttpContext.User.Identity is { IsAuthenticated: false })
      return;
    string? jobSeekerId = context.HttpContext.Request.RouteValues.TryGetValue("jobSeekerId", out object? val1)
      ? val1?.ToString()
      : context.HttpContext.Request.RouteValues.TryGetValue("id", out object? val2)
        ? val2?.ToString()
        : null;
    if (jobSeekerId is null)
    {
      context.Result = new BadRequestObjectResult("jobSeekerId is required.");
      return;
    }
    string? userId = context.HttpContext.User.Claims
      .FirstOrDefault(c => c.Type == "id")?.Value;
    if (userId is null || userId != jobSeekerId)
    {
      context.Result = new ForbidResult();
    }

  }
}
