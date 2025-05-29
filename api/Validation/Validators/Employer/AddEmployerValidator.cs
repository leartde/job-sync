using FluentValidation;
using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.EmployerDtos;

namespace Validation.Validators.Employer;

public class AddEmployerValidator : AbstractValidator<AddEmployerDto>
{
    public AddEmployerValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .MinimumLength(3).WithError("Invalid name length", "Name must be at least 3 characters long")
            .MaximumLength(35).WithError("Invalid name length", "Name cannot exceed 35 characters");

        RuleFor(x => x.Email)
            .NotNull()
            .EmailAddress().WithError("Invalid email address","Input must be a valid email address");
        
        RuleFor(x => x.Headquarters)
            .NotNull()
            .MinimumLength(3).WithError("Invalid headquarters input length", "Headquarters input must be at least 3 characters long")
            .MaximumLength(35).WithError("Invalid headquarters input length", "Headquarters input cannot exceed 35 characters");

        RuleFor(x => x.Industry)
            .NotNull();

        RuleFor(x => x.Phone)
            .NotNull();

        RuleFor(x => x.Description)
            .NotNull()
            .MinimumLength(20).WithError("Invalid description length",
                "Description must be at least 20 characters long")
            .MaximumLength(450).WithError("Invalid description length",
                "Description must be at least 450 characters long");

        RuleFor(x => x.Photo)
            .Must(IsImage)
            .WithError("Invalid file type","File input must be a valid image type")
            .When(x => x.Photo != null);
    }

    private bool IsImage(IFormFile? file)
    {
        string? type = Path.GetExtension(file?.FileName);
        string[] imageTypes = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".heic", ".svg"];
        return imageTypes.Contains(type);

    }

}