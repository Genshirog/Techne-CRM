using CRM.Core.Entities;

namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceDto
{
    public int ServiceCategoryId {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
}
public class CreateServiceDto : BaseServiceDto {}
public class UpdateServiceDto : BaseServiceDto
{
    public int Id {get;set;}
}
public class ServiceResponseDto
{
    public int Id {get;set;}
    public int ServiceCategoryId {get;set;}
    public string CategoryName {get;set;} =string.Empty;
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;}
}

public class ServiceDetailResponseDto : ServiceResponseDto
{
    public List<ServiceScopeResponseDto> Scopes {get;set;} = [];
    public List<ServiceWaiverResponseDto> Waivers {get;set;} = [];
    public List<ServiceDeliverableResponseDto> Deliverables {get;set;} = [];
    public List<ServiceTermResponseDto> Terms {get;set;} = [];
}
