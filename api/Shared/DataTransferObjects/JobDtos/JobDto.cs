using Shared.DataTransferObjects.AddressDtos;
using Shared.DataTransferObjects.SkillDtos;

namespace Shared.DataTransferObjects.JobDtos;

public abstract class JobDto
{

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double HourlyPay { get; set; }
    public string Type { get; set; } = string.Empty;
    public bool IsTakingApplications { get; set; }
    public bool HasMultipleSpots { get; set; }
    public List<string> Benefits { get; set; } = [];
}
