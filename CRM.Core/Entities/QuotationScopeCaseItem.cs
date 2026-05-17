namespace CRM.Core.Entities;

public class QuotationScopeCaseItem
{
    public int Id {get;set;}
    public int QuotationScopeCaseId {get;set;}
    public int ServiceScopeCaseItemId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationScopeCase QuotationScopeCase {get;set;} = null!;
    public ServiceScopeCaseItem ServiceScopeCaseItem {get;set;} = null!;

}
