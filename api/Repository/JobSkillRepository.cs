using Contracts;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Repository;

internal sealed class JobSkillRepository : RepositoryBase<JobSkill>, IJobSkillRepository
{
    public JobSkillRepository(RepositoryContext context) : base(context)
    {
    }

    public async Task<IEnumerable<JobSkill>> GetAllJobSkillsAsync()
    {
        return await FindAll()
            .Include(js => js.Job)
            .Include(js => js.Skill)
            .OrderBy(j => j.JobsId)
            .ToListAsync();

    }

    public async Task<JobSkill> GetJobSkillAsync(Guid jobId, Guid skillId)
    {
        return await FindByCondition(js => js.JobsId.Equals(jobId)
                                           && js.SkillsId.Equals(skillId))
            .Include(js => js.Job)
            .Include(js => js.Skill)
            .SingleAsync();
    }

    public async Task AddJobSkillsAsync(List<JobSkill> jobSkills)
    {
        await CreateBulk(jobSkills);
    }

    public void DeleteJobSkills(List<JobSkill> jobSkills)
    {
        DeleteBulk(jobSkills);
    }

    public void DeleteJobSkill(JobSkill jobSkill)
    {
      Delete(jobSkill);
    }
}
