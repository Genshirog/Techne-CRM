namespace CRM.Core.Entities;

public class CustomerContact
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public string Type {get;set;} = string.Empty;
    public string Value {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}
    public Customer Customer {get;set;} = null!;
}
