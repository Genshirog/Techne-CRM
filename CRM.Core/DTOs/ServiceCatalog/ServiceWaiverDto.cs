using CRM.Core.Entities;

namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceWaiverDto
{
    public int ServiceId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceWaiverDto : BaseServiceWaiverDto {}
public class ServiceWaiverResponseDto : BaseServiceWaiverDto
{
    public int Id {get;set;}
    public List<ServiceWaiverCaseResponseDto> Cases {get;set;} = [];
}

public class BaseServiceWaiverCaseDto
{
    public int ServiceWaiverId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceWaiverCaseDto : BaseServiceWaiverCaseDto {}
public class ServiceWaiverCaseResponseDto : BaseServiceWaiverCaseDto
{
    public int Id {get;set;}
    public List<ServiceWaiverCaseItemResponseDto> Items {get;set;} = [];
}

public class BaseServiceWaiverCaseItemDto
{
    public int ServiceWaiverCaseId {get;set;}
    public string Content {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceWaiverCaseItemDto : BaseServiceWaiverCaseItemDto {}
public class ServiceWaiverCaseItemResponseDto : BaseServiceWaiverCaseItemDto
{
    public int Id {get;set;}
}