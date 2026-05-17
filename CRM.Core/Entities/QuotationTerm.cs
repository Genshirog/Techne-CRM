namespace CRM.Core.Entities;

public class QuotationTerm
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public int ServiceTermId {get;set;}
    public bool IsIncluded {get;set;} = true;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public QuotationItem QuotationItem {get;set;} = null!;
    public ServiceTerm ServiceTerm {get;set;} = null!;
    public ICollection<QuotationTermItem> Items {get;set;} = [];
}
