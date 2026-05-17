namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationWaiverDto
{
    public int ServiceWaiverId {get;set;}
    public bool IsIncluded {get;set;} = true;
}

public class CreateQuotationWaiverDto : BaseQuotationWaiverDto
{
    public List<CreateQuotationWaiverCaseDto> Cases {get;set;} = [];
}

public class UpdateQuotationWaiverDto : BaseQuotationWaiverDto
{
    public List<UpdateQuotationWaiverCaseDto> Cases {get;set;} = [];
}

public class QuotationWaiverResponseDto : BaseQuotationWaiverDto
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<QuotationWaiverCaseResponseDto> Cases {get;set;} = [];
}