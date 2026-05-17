namespace CRM.Core.Entities;

public class User
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string PasswordHash {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
    public DateTime DateOfBirth {get;set;}
    public UserRole Role {get;set;} = UserRole.Customer;
    public int AccessLevel {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}
}

public enum UserRole{
        Customer,
        Admin,
        SuperAdmin,
        Technician,
    }
