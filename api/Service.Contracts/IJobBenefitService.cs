using Shared.DataTransferObjects.JobBenefitDtos;

namespace Service.Contracts;

public interface IJobBenefitService
{
    Task<IEnumerable<ViewJobBenefitDto>> GetBenefitsForJobAsync(Guid employerId, Guid jobId);
    Task<IEnumerable<ViewJobBenefitDto>> AddBenefitsForJobAsync(Guid employerId, Guid jobId, List<string> benefits);
    Task DeleteBenefitForJobAsync(Guid employerId, Guid jobId, string benefit);
}
