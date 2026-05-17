namespace CRM.Core.Entities;

public class JobOrderPart
{
    public int Id {get;set;}
    public int JobOrderId {get;set;}
    public string PartName {get;set;} = string.Empty;
    public int Quantity {get;set;}
    public decimal UnitPrice {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public JobOrder JobOrder {get;set;} = null!;
}
