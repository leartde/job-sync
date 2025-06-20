namespace Entities.Exceptions;

public sealed class RefreshTokenBadRequest : BadRequestException
{
    public RefreshTokenBadRequest() :
      base("Error retrieving or validating the refresh token")
    {}
}
