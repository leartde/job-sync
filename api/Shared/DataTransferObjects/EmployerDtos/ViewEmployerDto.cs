namespace Shared.DataTransferObjects.EmployerDtos;

public class ViewEmployerDto : EmployerDto
{
    public Guid Id { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    
}