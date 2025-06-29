namespace Shared.DataTransferObjects.UserDtos;

public class ViewUserDto : UserDto
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
