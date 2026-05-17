namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationTermItemDto
{
    public int ServiceTermItemId {get;set;}
}

public class CreateQuotationTermItemDto : BaseQuotationTermItemDto{}
public class UpdateQuotationTermItemDto : BaseQuotationTermItemDto{}

public class QuotationTermItemResponseDto : BaseQuotationTermItemDto
{
    public int Id {get;set;}
    public int QuotationTermId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}