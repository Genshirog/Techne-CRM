namespace CRM.Core.Entities;

public class QuotationScope
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public int ServiceScopeId {get;set;}
    public bool IsIncluded {get;set;} = true;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationItem QuotationItem {get;set;} = null!;
    public ServiceScope ServiceScope {get;set;} = null!;
    public ICollection<QuotationScopeCase> Cases {get;set;} = [];

}
