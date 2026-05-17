namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationScopeCaseItemDto
{
    public int ServiceScopeCaseItemId {get;set;}
}

public class CreateQuotationScopeCaseItemDto : BaseQuotationScopeCaseItemDto{}
public class UpdateQuotationScopeCaseItemDto : BaseQuotationScopeCaseItemDto{}

public class QuotationScopeCaseItemResponseDto : BaseQuotationScopeCaseItemDto
{
    public int Id {get;set;}
    public int QuotationScopeCaseId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}