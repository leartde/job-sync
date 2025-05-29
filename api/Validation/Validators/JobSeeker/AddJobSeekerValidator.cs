using FluentValidation;
using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.JobSeekerDtos;

namespace Validation.Validators.JobSeeker;

public class AddJobSeekerValidator : AbstractValidator<AddJobSeekerDto>
{
    public AddJobSeekerValidator()
    {
        RuleFor(x => x.FirstName)
            .NotNull()
            .MinimumLength(2).WithError("Invalid first name length", "First name must be at least 2 characters long")
            .MaximumLength(25).WithError("Invalid first name length", "First name length cannot exceed 25 characters");

        RuleFor(x => x.LastName)
            .NotNull()
            .MinimumLength(2).WithError("Invalid last name length", "Last name must be at least 2 characters long")
            .MaximumLength(25).WithError("Invalid last name length", "Last name length cannot exceed 25 characters");


        RuleFor(x => x.Gender)
            .NotNull()
            .Must(ValidGender).WithError("Invalid gender", "Gender options are:male, female or non-binary");

        RuleFor(x => x.Resume)
            .Must(IsPdfOrWord)
            .When(x => x.Resume != null)
            .WithError("File type error", "Resume must be in pdf or word format");

        RuleFor(x => x.Skills)
            .Must(ValidSkills)
            .When(x => x.Skills is { Count: > 0 });
    }

    private bool IsPdfOrWord(IFormFile? file)
    {
        string? type = Path.GetExtension(file?.FileName);
        return type is ".pdf" or ".doc" or ".docx";
    }

    private bool ValidGender(string? gender)
    { List<string?> validGenders = ["male", "female", "non-binary"];
        return validGenders.Contains(gender?.ToLower());
    }

    private bool ValidSkills(List<string>? skills)
    {
        return skills?.Count <= 20;
    }
    
}