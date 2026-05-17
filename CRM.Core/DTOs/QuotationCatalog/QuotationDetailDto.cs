namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationDetailDto
{
    public string ItemName {get;set;} = string.Empty;
    public int Quantity {get;set;}
    public decimal UnitPrice {get;set;}
}

public class CreateQuotationDetailDto : BaseQuotationDetailDto{}
public class UpdateQuotationDetailDto : BaseQuotationDetailDto{}

public class QuotationDetailResponseDto : BaseQuotationDetailDto
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
