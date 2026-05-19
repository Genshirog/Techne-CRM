namespace CRM.Core.Entities;

public class Customer
{
    public int Id {get;set;}
    public int UserId {get;set;}
    public int? CompanyId {get;set;}
    public bool IsPrimary {get;set;} = true;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public User? User {get;set;} = null!;
    public Company? Company {get;set;}
}
