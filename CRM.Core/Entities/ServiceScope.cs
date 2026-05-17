namespace CRM.Core.Entities;

public class ServiceScope
{
    public int Id {get;set;}
    public int ServiceId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Service Service {get;set;} = null!;
    public ICollection<ServiceScopeCase> ServiceScopeCases {get;set;} = [];

}
