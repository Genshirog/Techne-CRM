namespace CRM.Core.Entities;

public class QuotationWaiverCase
{
    public int Id {get;set;}
    public int QuotationWaiverId {get;set;}
    public int ServiceWaiverCaseId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationWaiver QuotationWaiver {get;set;} = null!;
    public ServiceWaiverCase ServiceWaiverCase {get;set;} = null!;
    public ICollection<QuotationWaiverCaseItem> Items {get;set;} = [];
}
