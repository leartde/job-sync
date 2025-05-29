using FluentValidation;
using Microsoft.AspNetCore.Http;
using Shared.DataTransferObjects.JobDtos;

namespace Validation.Validators.Job;

public class AddJobValidator : AbstractValidator<AddJobDto>
{
    public AddJobValidator()
    {
        RuleFor(x => x.Title)
            .NotNull()
            .MinimumLength(5).WithError("Invalid title length", "Title must be at least 5 characters long")
            .MaximumLength(40).WithError("Invalid title length", "Title length cannot exceed 40 characters");

        RuleFor(x => x.HourlyPay)
            .NotNull()
            .GreaterThanOrEqualTo(2).WithMessage("Minimum hourly pay is 2 dollars/hr")
            .LessThanOrEqualTo(200).WithMessage("Maximum hourly pay is 200 dollars/hr");

        RuleFor(x => x.Description)
            .NotNull()
            .MinimumLength(20).WithError("Invalid description length","Description must be at least 20 characters long")
            .MaximumLength(4000).WithError("Invalid description length","Description cannot exceed 4000 characters");
        
    }
    
    
    
    
    
    
}