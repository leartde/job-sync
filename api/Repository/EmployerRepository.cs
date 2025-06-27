using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Extensions;
using Shared.RequestFeatures;

namespace Repository;

internal sealed class EmployerRepository : RepositoryBase<Employer>, IEmployerRepository
{
    public EmployerRepository(RepositoryContext context) : base(context){}
    public async Task<PagedList<Employer>> GetAllEmployersAsync(EmployerParameters employerParameters)
    {
        List<Employer> employers = await FindAll()
            .Include(e => e.User)
            .Include(e => e.Jobs)
            .Filter(employerParameters.Industry)
            .Search(employerParameters.SearchTerm)
            .Skip((employerParameters.PageNumber - 1) * employerParameters.PageSize)
            .Take(employerParameters.PageSize)
            .Sort(employerParameters.OrderBy)
            .ToListAsync();

        int count = await FindAll()
            .Filter(employerParameters.Industry)
            .Search(employerParameters.SearchTerm)
            .CountAsync();

        return new PagedList<Employer>(employers, count, employerParameters.PageNumber, employerParameters.PageSize);

    }

    public async Task<Employer> GetEmployerAsync(Guid id)
    {
        return await FindByCondition(e => e.Id.Equals(id))
            .Include(e => e.Jobs)
           .SingleAsync();
    }

    public async Task<Employer> GetEmployerByUserIdAsync(Guid userId)
    {
     
        return await FindByCondition(e => e.UserId.Equals(userId))
          .Include(e => e.Jobs)
          .ThenInclude(j => j.Benefits)
          .Include(e => e.Jobs)
          .ThenInclude(j => j.Applications)
          .Include(e => e.Jobs)
          .ThenInclude(j => j.Bookmarks)
          .SingleAsync();
        
    }

    public async Task AddEmployerAsync(Employer employer)
    {
        await Create(employer);
    }

    public void DeleteEmployer(Employer employer)
    {
        Delete(employer);
    }

    public void UpdateEmployer(Employer employer)
    {
        Update(employer);
    }
}
