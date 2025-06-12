using System.Dynamic;
using Contracts;
using Entities.Models;
using FluentAssertions;
using FluentValidation.Results;
using Moq;
using Service.Contracts;
using Service.DataShaping;
using Shared.DataTransferObjects.JobDtos;
using Shared.Mapping;
using Shared.RequestFeatures;
using Tests.Data;
using Validation.Validators.Job;

namespace Tests.Services;

public class JobServiceTests
{
    private readonly Mock<IJobService> _mockService;
    private List<Job> _jobs;
    private AddJobValidator _validator;
    private readonly IDataShaper<ViewJobDto> _dataShaper;


    public JobServiceTests()
    {
        _mockService = new Mock<IJobService>();
        _validator = new AddJobValidator();
        _jobs = FakeJobs.Jobs;
        _dataShaper = new DataShaper<ViewJobDto>();
    }

    [Fact]
    public async Task GetAllJobs_ShouldReturnListOfAllJobsWithAllFields_WhenNullParametersAreGiven()
    {
        //Arrange
        JobParameters jobParams = new();
        PagedList<Job> jobs = new PagedList<Job>(
            _jobs,
            3,
            1,
            3
            );
        IEnumerable<ExpandoObject> shapedData = 
            _dataShaper.ShapeData(jobs.Select(j => j.ToDto()), jobParams.Fields);
        _mockService.Setup(service => service.GetAllJobsAsync(jobParams))
            .ReturnsAsync((shapedData, jobs.MetaData));
       
        //Act
        var result = await _mockService.Object.GetAllJobsAsync(jobParams);

        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<(IEnumerable<ExpandoObject>, MetaData)>();
        result.jobs.Count().Should().Be(3);
    }

    [Fact]
    public async Task GetAllJobsAsync_ShouldReturnJobDtosWithSelectedAttributes_WhenFieldsParametersAreGiven()
    {
        //Arrange
        JobParameters jobParams = new()
        {
            Fields = "title, employer"
        };
        PagedList<Job> jobs = new PagedList<Job>(
            _jobs,
            3,
            1,
            3
        );
        List<ExpandoObject> shapedData = 
            _dataShaper.ShapeData(jobs.Select(j => j.ToDto()), jobParams.Fields).ToList();
        _mockService.Setup(service => service.GetAllJobsAsync(jobParams))
            .ReturnsAsync((shapedData.ToList(), jobs.MetaData));
        
        //Act
        var result = await _mockService.Object.GetAllJobsAsync(jobParams);
        
        //Assert
        var jobsList = result.jobs.ToList(); 
        result.Should().NotBeNull();
        result.Should().BeOfType<(IEnumerable<ExpandoObject>, MetaData)>();
        foreach (var jobDictionary in jobsList.Cast<IDictionary<string, object>>())
        {
            jobDictionary.Keys.Should().BeEquivalentTo(["title", "employer"]);
        }
    }

    [Fact]
    public async Task GetAllJobsAsync_ShouldReturnLimitedJobs_WhenPaginationParametersAreGiven()
    {
        //Arrange
        JobParameters jobParams = new()
        {
            PageNumber = 2,
            PageSize = 1,
        };
        PagedList<Job> jobs = new PagedList<Job>(
            _jobs,
            _jobs.Count,
            jobParams.PageNumber,
            jobParams.PageSize);
        
        List<ExpandoObject> shapedData = 
            _dataShaper.ShapeData(jobs.Select(j => j.ToDto()), jobParams.Fields).ToList();
        _mockService.Setup(service => service.GetAllJobsAsync(jobParams))
            .ReturnsAsync((shapedData.ToList()
                    .Skip((jobParams.PageNumber - 1) * jobParams.PageSize)
                    .Take(jobParams.PageSize)
                , jobs.MetaData));
        
        //Act
        var result = await _mockService.Object.GetAllJobsAsync(jobParams);
        
        //Assert
        List<ExpandoObject> resultJobsList = result.jobs.ToList(); 
        result.Should().NotBeNull();
        result.Should().BeOfType<(IEnumerable<ExpandoObject>, MetaData)>();
        result.jobs.Count().Should().Be(jobParams.PageSize);
      
        List<ExpandoObject> allJobsList = _dataShaper.ShapeData(_jobs.Select(j => j.ToDto()), jobParams.Fields).ToList();

        List<ExpandoObject> expectedJobs = allJobsList
            .Skip((jobParams.PageNumber - 1) * jobParams.PageSize)
            .Take(jobParams.PageSize)
            .ToList();

        List<ExpandoObject> unexpectedJobs = allJobsList
            .Except(expectedJobs)
            .ToList();

        foreach (ExpandoObject expectedJob in expectedJobs)
        {
            resultJobsList.Should().ContainEquivalentOf(expectedJob);
        }

        foreach (ExpandoObject unexpectedJob in unexpectedJobs)
        {
            resultJobsList.Should().NotContainEquivalentOf(unexpectedJob);
        }

    }
 

    [Fact]
    public async Task GetJobForEmployerAsync_ShouldReturnJobDto_IfItExists()
    {
        //Arrange
        Guid jobId = new Guid("a346f977-15ea-4144-a090-d943d33b21f8");
        Guid employerId = new Guid("586e6f00-d455-43b0-8bc7-bc045dadcf98");
        _mockService.Setup(service => service.GetJobForEmployerAsync(employerId, jobId))
            .ReturnsAsync(_jobs.Single(j => j.Id.Equals(jobId) && j.Employer!.Id.Equals(employerId)).ToDto())
            ;
        
        //Act
        var result = await _mockService.Object.GetJobForEmployerAsync(employerId, jobId);
        
        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ViewJobDto>();
        result.Should().BeEquivalentTo(_jobs.First().ToDto());
    }



    [Fact]
    public async Task ValidateJobAsync_ShouldReturnTrue_WhenItPasses()
    {
        //Arrange
        AddJobDto jobDto = FakeJobs.AddJobDto;
        
        //Act
          var result = await _validator.ValidateAsync(jobDto);
          
          //Assert
          result.Should().NotBeNull();
          result.Should().BeOfType<ValidationResult>();
          result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateJobAsync_ShouldReturnValidationError_WhenPayExceedsRange()
    {
        //Arrange
        AddJobDto jobDto = FakeJobs.AddJobDto;
        jobDto.HourlyPay = 8000;
        
        //Act
        var result = await _validator.ValidateAsync(jobDto);
        
        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ValidationResult>();
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task AddJobAsync_ShouldSaveJobToList_AndReturnIt()
    {
        //Arrange
        AddJobDto jobDto = FakeJobs.AddJobDto;
        Guid employerId = FakeEmployers.SingleEmployer.Id;
        Job jobToAdd = new();
        _mockService.Setup(service => service.AddJobForEmployerAsync(employerId, jobDto))
            .Callback<Guid,AddJobDto>((id, dto) =>
            {
                    dto.ToEntity(jobToAdd);
                    jobToAdd.EmployerId = id;
                    _jobs.Add(jobToAdd);
            })
            .ReturnsAsync(jobToAdd.ToDto);
        
        //Act
        var result = await _mockService.Object.AddJobForEmployerAsync(employerId, jobDto);
        
        //Assert
       result.Should().NotBeNull();
        result.Should().BeOfType<ViewJobDto>();
        _jobs.Should().Contain(jobToAdd);
    }

    [Fact]
    public async Task UpdateJobAsync_ShouldUpdateJobDetails_AndReturnIt()
    {
        //Arrange
        UpdateJobDto jobDto = new UpdateJobDto()
        {
            Title = "Brand New Title!"
        };

        Job job = new();
        Guid employerId = new Guid("586e6f00-d455-43b0-8bc7-bc045dadcf98");
        Guid jobId = new Guid("a346f977-15ea-4144-a090-d943d33b21f8");
        _mockService.Setup(service => service.UpdateJobForEmployerAsync(employerId, jobId, jobDto))
            .Callback<Guid, Guid, UpdateJobDto>((eId, id, dto) =>
            {
                job = _jobs.Single(j => j.EmployerId.Equals(eId) && j.Id.Equals(id));
                dto.ToEntity(job);
            })
            .ReturnsAsync(job.ToDto);

        //Act
        var result = await _mockService.Object.UpdateJobForEmployerAsync(employerId, jobId, jobDto);
        
        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ViewJobDto>();

        Job updatedJob = _jobs.First();
        updatedJob.Title.Should().Be(jobDto.Title);
        
        _mockService.Verify(service => service.UpdateJobForEmployerAsync(employerId, jobId,jobDto), Times.Once);
    }

    [Fact]
    public async Task DeleteJobAsync_ShouldRemoveItFromListOfJobs()
    {
        //Arrange
        Guid employerId = new Guid("586e6f00-d455-43b0-8bc7-bc045dadcf98");
        Guid jobId = new Guid("a346f977-15ea-4144-a090-d943d33b21f8");
        _mockService.Setup(service => service.DeleteJobForEmployerAsync(employerId, jobId))
            .Callback<Guid, Guid>((eId, jId) =>
            {
                Job job = _jobs.Single(j => j.EmployerId.Equals(eId) && j.Id.Equals(jId));
                _jobs.Remove(job);
            });
        
        //Act
        await _mockService.Object.DeleteJobForEmployerAsync(employerId, jobId);
        
        //Assert
        _jobs.Any(j => j.Id.Equals(jobId) && j.EmployerId.Equals(employerId)).Should().BeFalse();
    }

   
}
    
    
