namespace CRM.Core.Entities;

public class QuotationTermItem
{
    public int Id {get;set;}
    public int QuotationTermId {get;set;}
    public int ServiceTermItemId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationTerm QuotationTerm {get;set;} = null!;
    public ServiceTermItem ServiceTermItem {get;set;} = null!;

}
