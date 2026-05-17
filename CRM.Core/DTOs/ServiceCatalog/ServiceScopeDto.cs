namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceScopeDto
{
    public int ServiceId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceScopeDto : BaseServiceScopeDto{}
public class UpdateServiceScopeDto : BaseServiceScopeDto
{
    public int Id {get;set;}
}
public class ServiceScopeResponseDto : BaseServiceScopeDto
{
    public int Id {get;set;}
    public List<ServiceScopeCaseResponseDto> Cases {get;set;} = [];
}

public class BaseServiceScopeCaseDto
{
    public int ServiceScopeId {get;set;}
    public string Title {get;set;} =string.Empty;
    public int Order {get;set;}
}
public class CreateServiceScopeCaseDto : BaseServiceScopeCaseDto {}
public class ServiceScopeCaseResponseDto : BaseServiceScopeCaseDto
{
    public int Id {get;set;}
    public List<ServiceScopeCaseItemResponseDto> Items {get;set;} = [];
}

public class BaseServiceScopeCaseItemDto
{
    public int ServiceScopeCaseId {get;set;}
    public string Content {get;set;} = string.Empty;
    public int Order {get;set;}
}
public class CreateServiceScopeCaseItemDto : BaseServiceScopeCaseItemDto{}
public class ServiceScopeCaseItemResponseDto : BaseServiceScopeCaseItemDto
{
    public int Id {get;set;}
}
