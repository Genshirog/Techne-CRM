namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseCustomerAddressDto
{
    public int CustomerId {get;set;}
    public string Label {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public bool IsDefault {get;set;} = false;
}

public class CreateCustomerAddressDto : BaseCustomerAddressDto{}
public class UpdateCustomerAddressDto : BaseCustomerAddressDto
{
    public int Id {get;set;}
}

public class CustomerAddressResponseDto : BaseCustomerAddressDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
