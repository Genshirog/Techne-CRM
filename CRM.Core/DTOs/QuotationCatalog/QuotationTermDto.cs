namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationTermDto
{
    public int ServiceTermId {get;set;}
    public bool IsIncluded {get;set;}
}

public class CreateQuotationTermDto : BaseQuotationTermDto
{
    public List<CreateQuotationTermItemDto> Items {get;set;} = [];
}
public class UpdateQuotationTermDto : BaseQuotationTermDto
{
    public List<UpdateQuotationTermItemDto> Items {get;set;} = [];
}

public class QuotationTermResponseDto : BaseQuotationTermDto
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationTermItemResponseDto> Items {get;set;} = [];
}
