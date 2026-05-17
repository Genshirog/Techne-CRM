namespace CRM.Core.Entities;

public class QuotationScopeCase
{
    public int Id {get;set;}
    public int QuotationScopeId {get;set;}
    public int ServiceScopeCaseId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public QuotationScope QuotationScope {get;set;} = null!;
    public ServiceScopeCase ServiceScopeCase {get;set;} = null!;
    public ICollection<QuotationScopeCaseItem> Items {get;set;} = [];

}
