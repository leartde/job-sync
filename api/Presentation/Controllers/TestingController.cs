using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Presentation.Controllers;

[Route("api/testing")]
[ApiController]
public class TestingController : ControllerBase
{
  [HttpGet("validate-token")]
    public IActionResult ValidateTokenManually()
    {
      var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
      var secret = Environment.GetEnvironmentVariable("SECRET");
      var key = Encoding.UTF8.GetBytes(secret!);
    
      var handler = new JwtSecurityTokenHandler();
      try
      {
        handler.ValidateToken(token, new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = "JobSyncApi",
          ValidAudience = "https://localhost:5248",
          IssuerSigningKey = new SymmetricSecurityKey(key)
        }, out _);
        
        return Ok("Token is valid");
      }
      catch (Exception ex)
      {
        return BadRequest(new {
          Error = ex.Message,
          SecretLength = secret?.Length,
          KeyLength = key.Length,
          Token = token[..10] + "..."
        });
      }
    }
    
    [HttpGet("/api/jobs/debug-claims")]
    public IActionResult DebugClaims()
    {
      return Ok(new {
        User.Identity?.Name,
        Claims = User.Claims.Select(c => new { c.Type, c.Value }),
        Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value)
      });
    }
}
