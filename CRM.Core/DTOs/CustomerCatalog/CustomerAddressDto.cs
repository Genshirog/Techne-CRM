namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseCustomerAddressDto
{
    public int CustomerId { get; set; }
    public string Label { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;

    // Structured address fields
    public string Street { get; set; } = string.Empty;
    public string? Street2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = "PH";
}

public class CreateCustomerAddressDto : BaseCustomerAddressDto { }

public class UpdateCustomerAddressDto : BaseCustomerAddressDto
{
    public int Id { get; set; }
}

public class CustomerAddressResponseDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string Label { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    // Structured address
    public string Street { get; set; } = string.Empty;
    public string? Street2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string FullAddress { get; set; } = string.Empty;
}