namespace CRM.Core.Entities;

public class Service
{
    public int Id {get;set;}
    public int ServiceCategoryId {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ServiceCategory ServiceCategory {get;set;} = null!;
    public ICollection<ServiceScope> Scopes {get;set;} = [];
    public ICollection<ServiceWaiver> Waivers {get;set;} = [];
    public ICollection<ServiceTerm> Terms {get;set;} = [];
    public ICollection<ServiceDeliverable> Deliverables {get;set;} = [];

}
