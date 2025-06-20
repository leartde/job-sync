namespace Service.Contracts;

public interface IServiceManager
{
    IAddressService AddressService { get; }
    IJobService JobService { get; }
    IEmployerService EmployerService { get;  }
    IJobSeekerService JobSeekerService { get; }
    IAuthenticationService AuthenticationService { get; }
    IJobApplicationService JobApplicationService { get; }
    IBookmarkService BookmarkService { get; }
    IJobBenefitService JobBenefitService { get; }
    ISkillService SkillService { get; }
    
}
