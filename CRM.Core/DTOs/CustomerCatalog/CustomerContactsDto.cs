namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseCustomerContactsDto
{
    public int CustomerId {get;set;}
    public string Type {get;set;} = string.Empty;
    public string Value {get;set;} = string.Empty;
}

public class CreateCustomerContactDto : BaseCustomerContactsDto{}
public class UpdateCustomerContactDto : BaseCustomerContactsDto
{
    public int Id;
}

public class CustomerContactResponseDto : BaseCustomerContactsDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
