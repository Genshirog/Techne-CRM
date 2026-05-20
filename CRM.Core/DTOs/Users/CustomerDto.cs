using CRM.Core.DTOs.CustomerCatalog;

namespace CRM.Core.DTOs.Users;

public class BaseCustomerDto
{
    public int UserId {get;set;}
    public int? CompanyId {get;set;}
    public bool IsPrimary {get;set;} = true;
}

public class CreateCustomerDto : BaseCustomerDto {}
public class UpdateCustomerDto : BaseCustomerDto
{
    public int Id {get;set;}
}

public class CustomerResponseDto : BaseCustomerDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
    public string? CompanyName {get;set;}
    public string? CompanyEmail {get;set;}
    public List<CustomerAddressResponseDto>? CustomerAddress {get;set;}
    public List<CustomerContactResponseDto>? CustomerContact {get;set;}
    public List<CustomerTagResponseDto>? CustomerTag {get;set;}
    public List<CustomerNoteResponseDto>? CustomerNote {get;set;}
}