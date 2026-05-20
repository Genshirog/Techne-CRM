namespace CRM.Core.Entities;

public class CustomerTag
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public int TagId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public Customer Customer {get;set;} = null!;
    public Tag Tag {get;set;} = null!;
}
