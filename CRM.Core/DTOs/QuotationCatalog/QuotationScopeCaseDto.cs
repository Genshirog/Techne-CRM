namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationScopeCaseDto
{
    public int ServiceScopeCaseId {get;set;}
}

public class CreateQuotationScopeCaseDto : BaseQuotationScopeCaseDto
{
    public List<CreateQuotationScopeCaseItemDto> Items {get;set;} = [];
}

public class UpdateQuotationScopeCaseDto : BaseQuotationScopeCaseDto
{
    public List<UpdateQuotationScopeCaseItemDto> Items {get;set;} = [];
}

public class QuotationScopeCaseResponseDto : BaseQuotationScopeCaseDto
{
    public int Id {get;set;}
    public int QuotationScopeId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationScopeCaseItemResponseDto> Items {get;set;} = [];
}
