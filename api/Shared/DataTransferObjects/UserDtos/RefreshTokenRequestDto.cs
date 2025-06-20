namespace Shared.DataTransferObjects.UserDtos;

public class RefreshTokenRequestDto
{
  public string? AccessToken { get; set; }
  public bool IsPersistent { get; set; }
}
