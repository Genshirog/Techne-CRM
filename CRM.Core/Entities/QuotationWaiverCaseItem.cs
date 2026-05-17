namespace CRM.Core.Entities;

public class QuotationWaiverCaseItem
{
    public int Id {get;set;}
    public int QuotationWaiverCaseId {get;set;}
    public int ServiceWaiverCaseItemId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationWaiverCase QuotationWaiverCase {get;set;} = null!;
    public ServiceWaiverCaseItem ServiceWaiverCaseItem {get;set;} = null!;

}
