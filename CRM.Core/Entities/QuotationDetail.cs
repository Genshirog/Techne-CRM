namespace CRM.Core.Entities;

public class QuotationDetail
{
    public int Id {get;set;}
    public int QuotationItemId {get;set;}
    public string ItemName {get;set;} = string.Empty;
    public int Quantity {get;set;}
    public decimal UnitPrice {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public QuotationItem QuotationItem {get;set;} = null!;
}
