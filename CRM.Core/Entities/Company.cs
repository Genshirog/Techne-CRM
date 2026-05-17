namespace CRM.Core.Entities;

public class Company
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public string LogoUrl {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}
}
