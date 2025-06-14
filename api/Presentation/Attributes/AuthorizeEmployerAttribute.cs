using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Presentation.Attributes;

public class AuthorizeEmployerAttribute : AuthorizeAttribute, IAuthorizationFilter
{
  public void OnAuthorization(AuthorizationFilterContext context)
  {
    if (context.HttpContext.User.Identity is { IsAuthenticated: false })
      return;
    string? employerId = context.HttpContext.Request.RouteValues["employerId"]?.ToString();
    if (employerId == null)
    {
      context.Result = new BadRequestObjectResult("employerId is required.");
      return;
    }
    string? userId = context.HttpContext.User.Claims
      .FirstOrDefault(c => c.Type == "id")?.Value;

    if (userId is null || !userId.Equals(employerId))
    {
      context.Result = new ForbidResult();
    }
  }
}
