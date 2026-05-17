namespace CRM.Core.Entities;

public class JobOrderReport
{
    public int Id {get;set;}
    public int JobOrderId {get;set;}
    public int QuotationItemId {get;set;}
    public string? Findings {get;set;}
    public string? ActionsTaken {get;set;}
    public string? Recommendation {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    
    public JobOrder JobOrder {get;set;} = null!;
    public QuotationItem QuotationItem {get;set;} = null!;
}
