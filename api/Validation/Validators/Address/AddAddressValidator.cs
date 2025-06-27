using FluentValidation;
using Shared.DataTransferObjects.AddressDtos;

namespace Validation.Validators.Address;

public class AddAddressValidator : AbstractValidator<AddAddressDto>
{
    public AddAddressValidator()
    {
        RuleFor(x => x.Country)
            .NotNull()
            .Must(ValidCountry).WithError("Invalid country", "Available countries are United States, Canada, United Kingdom, Australia");

        RuleFor(x => x.City)
            .NotNull()
            .MinimumLength(2).WithError("Invalid city name length", "City name must be at least 2 characters long")
            .MaximumLength(50).WithError("Invalid city name length", "City name cannot exceed 50 characters");

        RuleFor(x => x.ZipCode)
            .NotNull()
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
