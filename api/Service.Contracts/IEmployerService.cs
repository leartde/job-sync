using Entities.Models;
using Shared.DataTransferObjects.EmployerDtos;
using Shared.RequestFeatures;

namespace Service.Contracts;

public interface IEmployerService
{
    Task<PagedList<ViewEmployerDto>> GetAllEmployersAsync(EmployerParameters employerParameters);
    Task<ViewEmployerDto> GetEmployerAsync(Guid id);
    Task<ViewEmployerDto> AddEmployerAsync(AddEmployerDto employerDto);
    Task<ViewEmployerDto> UpdateEmployerAsync(Guid id, UpdateEmployerDto employerDto);
    Task DeleteEmployerAsync(Guid id);
}