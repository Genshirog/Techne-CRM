namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationDeliverableDto
{
    public int ServiceDeliverableId {get;set;}
    public bool IsIncluded {get;set;}
}

public class CreateQuotationDeliverableDto : BaseQuotationDeliverableDto{}
public class UpdateQuotationDeliverableDto : BaseQuotationDeliverableDto{}
public class QuotationDeliverableResponseDto : BaseQuotationDeliverableDto
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
