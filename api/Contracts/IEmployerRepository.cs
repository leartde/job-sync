using Entities.Models;
using Shared.RequestFeatures;

namespace Contracts;

public interface IEmployerRepository
{
    Task<PagedList<Employer>> GetAllEmployersAsync(EmployerParameters employerParameters);
    Task<Employer> GetEmployerAsync(Guid id);
    Task<Employer> GetEmployerByUserIdAsync(Guid userId);
    Task AddEmployerAsync(Employer employer);
    void DeleteEmployer(Employer employer);
    void UpdateEmployer(Employer employer);

}
    