namespace CRM.Core.Entities;

public class CustomerAddress
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public string Label {get;set;} = string.Empty;
    public Address Address {get;set;} = new Address();
    public bool IsDefault {get;set;} = false;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Customer Customer {get;set;} = null!;
}

public class Address
{
    public string Street { get; init; } = string.Empty;
    public string? Street2 { get; init; }
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
    public string Country { get; init; } = "PH";

    public string FullAddress =>
        string.Join(", ", new[] { Street, Street2, City, State, PostalCode, Country }
            .Where(s => !string.IsNullOrWhiteSpace(s)));
            
    // Normalize on construction
    public Address Normalize() => new Address
    {
        Street     = Street.Trim().ToUpperInvariant(),
        Street2    = Street2?.Trim().ToUpperInvariant(),
        City       = City.Trim().ToUpperInvariant(),
        State      = State.Trim().ToUpperInvariant(),
        PostalCode = PostalCode.Trim(),
        Country    = Country.Trim().ToUpperInvariant()
    };
}