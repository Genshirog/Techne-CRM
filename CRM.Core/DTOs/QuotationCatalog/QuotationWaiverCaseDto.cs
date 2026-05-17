namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationWaiverCaseDto
{
    public int ServiceWaiverCaseId {get;set;}
}

public class CreateQuotationWaiverCaseDto : BaseQuotationWaiverCaseDto
{
    public List<CreateQuotationWaiverCaseItemDto> Items {get;set;} = [];
}

public class UpdateQuotationWaiverCaseDto : BaseQuotationWaiverCaseDto
{
    public List<UpdateQuotationWaiverCaseItemDto> Items {get;set;} = [];
}

public class QuotationWaiverCaseResponseDto : BaseQuotationWaiverCaseDto
{
    public int Id {get;set;}
    public int QuotationWaiverId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationWaiverCaseItemResponseDto> Items {get;set;} = [];
}