namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceTermDto
{
    public int ServiceId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceTermDto : BaseServiceTermDto{}

public class ServiceTermResponseDto : BaseServiceTermDto
{
    public int Id {get;set;}
    public List<ServiceTermItemResponseDto> Items {get;set;} = [];
}

public class BaseServiceTermItemDto
{
    public int ServiceTermId {get;set;}
    public string Content {get;set;} = string.Empty;
    public int Order {get;set;}   
}
public class CreateServiceTermItemDto : BaseServiceTermItemDto {}
public class ServiceTermItemResponseDto : BaseServiceTermItemDto
{
    public int Id {get;set;}
}
