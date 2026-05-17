namespace CRM.Core.Entities;

public class CustomerAddress
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public string Label {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public bool IsDefault {get;set;} = false;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Customer Customer {get;set;} = null!;
}
