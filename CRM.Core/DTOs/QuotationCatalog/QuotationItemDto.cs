namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationItemDto
{
    public int ServiceId {get;set;}
}

public class CreateQuotationItemDto : BaseQuotationItemDto
{
    public List<CreateQuotationScopeDto> Scopes {get;set;} = [];
    public List<CreateQuotationWaiverDto> Waivers {get;set;} = [];
    public List<CreateQuotationTermDto> Terms {get;set;} = [];
    public List<CreateQuotationDeliverableDto> Deliverables {get;set;} = [];
    public List<CreateQuotationDetailDto> Details {get;set;} = [];
}

public class UpdateQuotationItemDto : BaseQuotationItemDto
{
    public List<UpdateQuotationScopeDto> Scopes {get;set;} = [];
    public List<UpdateQuotationWaiverDto> Waivers {get;set;} = [];
    public List<UpdateQuotationTermDto> Terms {get;set;} = [];
    public List<UpdateQuotationDeliverableDto> Deliverables {get;set;} = [];
    public List<UpdateQuotationDetailDto> Details {get;set;} = [];
}

public class QuotationItemResponseDto : BaseQuotationItemDto
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationScopeResponseDto> Scopes {get;set;} = [];
    public List<QuotationWaiverResponseDto> Waivers {get;set;} = [];
    public List<QuotationTermResponseDto> Terms {get;set;} = [];
    public List<QuotationDeliverableResponseDto> Deliverables {get;set;} = [];
    public List<QuotationDetailResponseDto> Details {get;set;} = [];
}
