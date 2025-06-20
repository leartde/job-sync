namespace Entities.Exceptions;

public class AccessTokenBadRequest : BadRequestException
{
  public AccessTokenBadRequest() :
    base("Error retrieving or validating the access token")
  {
  }
}
