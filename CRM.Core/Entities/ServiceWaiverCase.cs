namespace CRM.Core.Entities;

public class ServiceWaiverCase
{
    public int Id {get;set;}
    public int ServiceWaiverId {get;set;}
    public string Title {get;set;} = string.Empty;
    public int Order {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ServiceWaiver ServiceWaiver {get;set;} = null!;
    public ICollection<ServiceWaiverCaseItem> ServiceWaiverCaseItems {get;set;} = [];
}
