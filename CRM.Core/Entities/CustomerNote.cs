namespace CRM.Core.Entities;

public class CustomerNote
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public int CreatedBy {get;set;}
    public string Note {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Customer Customer {get;set;} = null!;
    public User CreatedByUser {get;set;} = null!;
}
