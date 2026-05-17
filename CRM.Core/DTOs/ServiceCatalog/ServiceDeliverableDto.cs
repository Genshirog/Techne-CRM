namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceDeliverableDto
{
    public int ServiceId {get;set;}
    public string Content {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceDeliverableDto : BaseServiceDeliverableDto{}

public class ServiceDeliverableResponseDto : BaseServiceDeliverableDto
{
    public int Id {get;set;}
}
