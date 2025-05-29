
namespace Shared.DataTransferObjects.EmployerDtos;

public abstract class EmployerDto
{
    public Guid? UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Headquarters { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Industry { get; set; } = string.Empty;
    public DateOnly Founded { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? SecondaryPhone { get; set; }
}