namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationWaiverCaseItemDto
{
    public int ServiceWaiverCaseItemId {get;set;}
}

public class CreateQuotationWaiverCaseItemDto : BaseQuotationWaiverCaseItemDto{}
public class UpdateQuotationWaiverCaseItemDto : BaseQuotationWaiverCaseItemDto{}

public class QuotationWaiverCaseItemResponseDto : BaseQuotationWaiverCaseItemDto
{
    public int Id {get;set;}
    public int QuotationWaiverCaseId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
