namespace CRM.Core.Entities;

public class QuotationWaiver
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public int ServiceWaiverId {get;set;}
    public bool IsIncluded {get;set;} = true;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public QuotationItem QuotationItem {get;set;} = null!;
    public ServiceWaiver ServiceWaiver {get;set;} =null!;
    public ICollection<QuotationWaiverCase> Cases {get;set;} = [];
}
