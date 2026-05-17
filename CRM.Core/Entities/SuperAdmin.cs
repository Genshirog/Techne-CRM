namespace CRM.Core.Entities;

public class SuperAdmin
{
    public int Id {get;set;}
    public int UserId {get;set;}
    public string Department {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public User User {get;set;} = null!;
}
