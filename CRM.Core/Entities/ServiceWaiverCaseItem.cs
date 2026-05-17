namespace CRM.Core.Entities;

public class ServiceWaiverCaseItem
{
    public int Id {get;set;}
    public int ServiceWaiverCaseId {get;set;}
    public string Content {get;set;} = string.Empty;
    public int Order {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ServiceWaiverCase ServiceWaiverCase {get;set;} = null!;
}
