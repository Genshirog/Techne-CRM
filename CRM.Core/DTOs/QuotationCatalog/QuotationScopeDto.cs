namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationScopeDto
{
    public int ServiceScopeId {get;set;}
    public bool IsIncluded {get;set;}
}

public class CreateQuotationScopeDto : BaseQuotationScopeDto
{
    public List<CreateQuotationScopeCaseDto> Cases {get;set;} = [];
}

public class UpdateQuotationScopeDto : BaseQuotationScopeDto
{
    public List<UpdateQuotationScopeCaseDto> Cases {get;set;} = [];
}

public class QuotationScopeResponseDto : BaseQuotationScopeDto
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationScopeCaseResponseDto> Cases {get;set;} = [];
}