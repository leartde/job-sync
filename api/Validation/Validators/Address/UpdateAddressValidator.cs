using FluentValidation;
using Shared.DataTransferObjects.AddressDtos;
using Validation.Validators.Employer;

namespace Validation.Validators.Address;

public class UpdateAddressValidator : AbstractValidator<UpdateAddressDto>
{
    public UpdateAddressValidator()
    {
        RuleFor(x => x.Country)
            .Must(ValidCountry).WithError("Invalid country", "Available countries are United States, Canada, United Kingdom, Australia");

        RuleFor(x => x.City)
          .MinimumLength(2).WithError("Invalid city name length", "City name must be at least 2 characters long")
          .MaximumLength(50).WithError("Invalid city name length", "City name cannot exceed 50 characters");


        RuleFor(x => x.ZipCode)
          .GreaterThanOrEqualTo(10000).WithError("Invalid ZIP code", "ZIP code must be 5 digits long")
          .LessThanOrEqualTo(99999).WithError("Invalid ZIP code", "ZIP code must be 5 digits long");

    }

    private bool ValidCountry(string? country)
    {
        IEnumerable<string> countries = ["United States", "Canada", "United Kingdom", "Australia"];
        return 
            string.IsNullOrEmpty(country) || countries.Contains(country, StringComparer.OrdinalIgnoreCase);
    }
}
