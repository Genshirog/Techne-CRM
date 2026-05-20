namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseCustomerTagDto
{
    public int CustomerId {get;set;}
    public int TagId{get;set;}
}

public class CreateCustomerTagDto : BaseCustomerTagDto{}
public class UpdateCustomerTagDto : BaseCustomerTagDto
{
    public int Id {get;set;}
}

public class CustomerTagResponseDto : BaseCustomerTagDto
{
    public string TagName {get;set;} = string.Empty;
    public string TagColor {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;}
}

public class AssignCustomerTagDto
{
    public int TagId {get;set;}    
}
