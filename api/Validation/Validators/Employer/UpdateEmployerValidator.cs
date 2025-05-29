using FluentValidation;
using Shared.DataTransferObjects.EmployerDtos;

namespace Validation.Validators.Employer;

public class UpdateEmployerValidator : AbstractValidator<UpdateEmployerDto>
{
    public UpdateEmployerValidator()
    {
        RuleFor(x => x.Name)
            .MinimumLength(3).WithError("Invalid name length", "Name must be at least 3 characters long")
            .MaximumLength(35).WithError("Invalid name length", "Name cannot exceed 3 characters");
        
    }
    
   
    
}