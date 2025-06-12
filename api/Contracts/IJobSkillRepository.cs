using Entities.Models;

namespace Contracts;

public interface IJobSkillRepository
{
    Task<IEnumerable<JobSkill>> GetAllJobSkillsAsync();
    Task<JobSkill> GetJobSkillAsync(Guid jobId, Guid skillId);
    Task AddJobSkillsAsync(List<JobSkill>jobSkills);
    void DeleteJobSkills(List<JobSkill>jobSkills);
    void DeleteJobSkill(JobSkill jobSkill);
}
