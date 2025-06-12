using Contracts;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Service.Contracts;
using Shared.DataTransferObjects.JobDtos;

namespace Service;

public class ServiceManager : IServiceManager
{
    private readonly Lazy<IAddressService> _addressService;
    private readonly Lazy<IJobService> _jobService;
    private readonly Lazy<IEmployerService> _employerService;
    private readonly Lazy<IJobSeekerService> _jobSeekerService;
    private readonly Lazy<IAuthenticationService> _authenticationService;
    private readonly Lazy<IJobApplicationService> _applicationService;
    private readonly Lazy<IBookmarkService> _bookmarkService;
    private readonly Lazy<IJobBenefitService> _jobBenefitService;
    private readonly Lazy<ISkillService> _skillService;
    public ServiceManager(IRepositoryManager repository, ILoggerManager logger, UserManager<AppUser>
        userManager, IConfiguration configuration,IDataShaper<ViewJobDto>dataShaper, 
        ICloudinaryManager cloudinaryManager, IHttpContextAccessor _httpContextAccessor
        )
    {
        _addressService = new Lazy<IAddressService>(() => new
            AddressService(repository, logger));
        _jobService = new Lazy<IJobService>(() => new
            JobService(repository, logger, dataShaper, cloudinaryManager));
        _employerService = new Lazy<IEmployerService>(() => new
            EmployerService(repository, logger, cloudinaryManager)
        );
        _jobSeekerService = new Lazy<IJobSeekerService>(() => new 
            JobSeekerService(repository, logger, cloudinaryManager)
            );
        _authenticationService = new Lazy<IAuthenticationService>(() => new
            AuthenticationService(userManager,configuration, repository, _httpContextAccessor)
        );
        _applicationService = new Lazy<IJobApplicationService>(() => new
            JobApplicationService(repository));
        _bookmarkService = new Lazy<IBookmarkService>(() => new
            BookmarkService(repository)
        );
        _jobBenefitService = new Lazy<IJobBenefitService>(() => new
            JobBenefitService(repository)
        );
        _skillService = new Lazy<ISkillService>(() => new
            SkillService(repository)
        );
    }

    public IAddressService AddressService => _addressService.Value;
    public IJobService JobService => _jobService.Value;
    public IEmployerService EmployerService => _employerService.Value;
    public IJobSeekerService JobSeekerService => _jobSeekerService.Value;
    public IAuthenticationService AuthenticationService => _authenticationService.Value;
    public IJobApplicationService JobApplicationService => _applicationService.Value;
    public IBookmarkService BookmarkService => _bookmarkService.Value;
    public IJobBenefitService JobBenefitService => _jobBenefitService.Value;
    public ISkillService SkillService => _skillService.Value;
}
