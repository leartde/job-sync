using Entities.Models;
using FluentAssertions;
using FluentValidation.Results;
using Moq;
using Service.Contracts;
using Shared.DataTransferObjects.EmployerDtos;
using Shared.Mapping;
using Shared.RequestFeatures;
using Tests.Data;
using Validation.Validators.Employer;

namespace Tests.Services;

public class EmployerServiceTests
{
    private readonly Mock<IEmployerService> _mockService;
    private List<Employer> _employers;
    private AddEmployerValidator _validator;

    public EmployerServiceTests()
    {
        _mockService = new Mock<IEmployerService>();
        _employers = FakeEmployers.Employers;
        _validator = new AddEmployerValidator();
    }

    [Fact]
    public async Task GetAllEmployersAsync_ShouldReturnListOfEmployersDtos()
    {
        // Arrange
        var employerParams = new EmployerParameters();

        _mockService
            .Setup(service => service.GetAllEmployersAsync(employerParams))
            .ReturnsAsync(new PagedList<ViewEmployerDto>(
                _employers.Select(e => e.ToDto()).ToList(),
                _employers.Count,
                1,
                2
            ));

        // Act
        var result = await _mockService.Object.GetAllEmployersAsync(employerParams);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<PagedList<ViewEmployerDto>>();
        result.Should().NotBeEmpty();
        result.Count.Should().Be(2);
        result.Should().SatisfyRespectively(
            first => first.Name.Should().Be("Employer1"),
            second => second.Name.Should().Be("Employer2"));
    }

    [Fact]
    public async Task GetEmployerAsync_ShouldReturnEmployerDto_IfExists()
    {
        //Arrange
        _mockService.Setup(service => service.GetEmployerAsync(new Guid("586e6f00-d455-43b0-8bc7-bc045dadcf98")))
            .ReturnsAsync(_employers.Single(e => e.Name.Equals("Employer1")).ToDto);

        //Act
        var result = await _mockService.Object.GetEmployerAsync(new Guid("586e6f00-d455-43b0-8bc7-bc045dadcf98"));


        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ViewEmployerDto>();
        result?.Name.Should().Be("Employer1");
        result?.Id.ToString().Should().Be("586e6f00-d455-43b0-8bc7-bc045dadcf98");
    }

    [Fact]
    public async Task GetEmployerAsync_ShouldThrowException_WhenEmployerDoesNotExist()
    {
        // Arrange
        var invalidId = Guid.NewGuid();
        _mockService.Setup(service => service.GetEmployerAsync(invalidId))
            .ThrowsAsync(new InvalidOperationException(
                ".ThrowsAsync(new InvalidOperationException(\"Sequence contains no matching element\"));"));


        // Act
        ViewEmployerDto? result = null;
        try
        {
            result = await _mockService.Object.GetEmployerAsync(invalidId);
        }
        catch (InvalidOperationException)
        {
        }

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task ValidateEmployer_ShouldReturnTrue_WhenItPasses()
    {
        // Arrange
        var employerDto = new AddEmployerDto
        {
            Name = "Employer",
            Headquarters = "Albania",
            Phone = "+383 43 887 111"
        };

        // Act
        var result = await _validator.ValidateAsync(employerDto, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ValidationResult>();
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateEmployer_ShouldReturnValidationError_WhenNameIsEmpty()
    {
        // Arrange
        var employerDto = new AddEmployerDto
        {
            Name = "",
            Headquarters = "Albania",
            Phone = "+383 43 887 111"
        };

        // Act
        var result = await _validator.ValidateAsync(employerDto, CancellationToken.None);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(AddEmployerDto.Name));
    }
    

    [Fact]
    public async Task AddEmployerAsync_ShouldSaveEmployerToList_AndReturnIt()
    {
        //Arrange
        AddEmployerDto employerDto = new AddEmployerDto
        {
            Name = "Employer3",
            Headquarters = "Albania",
            Phone = "+383 43 887 111"
        };
        Employer employerToAdd = new Employer
        {
            Id = Guid.NewGuid(),
            Name = employerDto.Name!,
            Headquarters = employerDto.Headquarters!,
            Phone = employerDto.Phone!
        };
        _mockService.Setup(service => service.AddEmployerAsync(employerDto))
            .Callback<AddEmployerDto>(_ =>
                _employers.Add(employerToAdd)
            )
            .ReturnsAsync(new ViewEmployerDto
            {
                Name = employerDto.Name,
                Headquarters = employerDto.Headquarters,
                Phone = employerDto.Phone
            });

        //Act
        var result = await _mockService.Object.AddEmployerAsync(employerDto);

        //Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ViewEmployerDto>();
        _employers.Contains(employerToAdd).Should().BeTrue();
    }

    [Fact]
    public async Task UpdateEmployerAsync_ShouldUpdateGivenEmployer_AndReturnIt()
    {
        // Arrange
        var employerDto = new UpdateEmployerDto
        {
            Name = "UpdatedName",
            Headquarters = "Kosovo",
            Phone = "+123 444 444"
        };

        var employer = _employers.First();

        _mockService.Setup(service => service.UpdateEmployerAsync(employer.Id, employerDto))
            .Callback<Guid, UpdateEmployerDto>((id, dto) =>
            {
                var employerToUpdate = _employers.First(e => e.Id == id);
                employerToUpdate.Name = dto.Name!;
                employerToUpdate.Headquarters = dto.Headquarters!;
                employerToUpdate.Phone = dto.Phone!;
            })
            .ReturnsAsync(employer.ToDto);

        // Act
        var result = await _mockService.Object.UpdateEmployerAsync(employer.Id, employerDto);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<ViewEmployerDto>();

        var updatedEmployer = _employers.First(e => e.Id == result.Id);
        updatedEmployer.Name.Should().Be(result.Name);
        updatedEmployer.Headquarters.Should().Be(result.Headquarters);
        updatedEmployer.Phone.Should().Be(result.Phone);

            _mockService.Verify(service => service.UpdateEmployerAsync(employer.Id, employerDto), Times.Once);
    }

    [Fact]
    public async Task DeleteEmployer_ShouldRemoveItFromListOfEmployers()
    {
        //Arrange
        Guid idOfEmployerToRemove = _employers.First().Id;
        _mockService.Setup(service => service.DeleteEmployerAsync(idOfEmployerToRemove))
            .Callback<Guid>((id) =>
                {
                    Employer employer = _employers.Single(e => e.Id.Equals(id));
                    _employers.Remove(employer);
                }
            );

        //Act
        await _mockService.Object.DeleteEmployerAsync(idOfEmployerToRemove);

        //Assert
        _employers.SingleOrDefault(e => e.Id.Equals(idOfEmployerToRemove)).Should().BeNull();
    }
}
