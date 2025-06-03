using FluentValidation;
using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.JobSeekerDtos;

namespace Validation.Validators.JobSeeker;

public class UpdateJobSeekerValidator : AbstractValidator<UpdateJobSeekerDto>
{
    public UpdateJobSeekerValidator()
    {
        RuleFor(x => x.FirstName)
            .MinimumLength(2).WithError("Invalid first name length", "First name must be at least 2 characters long")
            .MaximumLength(25).WithError("Invalid first name length", "First name length cannot exceed 25 characters");

        RuleFor(x => x.LastName)
            .MinimumLength(2).WithError("Invalid last name length", "Last name must be at least 2 characters long")
            .MaximumLength(25).WithError("Invalid last name length", "Last name length cannot exceed 25 characters");


        RuleFor(x => x.Gender)
            .Must(ValidGender).WithError("Invalid gender", "Gender options are:male, female or non-binary");

        RuleFor(x => x.Resume)
            .Must(IsPdfOrWord)
            .WithError("File type error", "Resume must be in pdf or word format");

        

    }

    private bool IsPdfOrWord(IFormFile? file)
    {
        if (file is null) return true;
        string type = Path.GetExtension(file.FileName);
        return type is ".pdf" or ".doc" or ".docx";
    }

    private bool ValidGender(string? gender)
    {
        List<string> validGenders = ["male", "female", "non-binary"];
        return gender is null || validGenders.Contains(gender.ToLower());
    }
}
