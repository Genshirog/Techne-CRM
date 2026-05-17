namespace CRM.Core.Entities;

public class ServiceCategory
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public ServiceCategoryType Type {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ICollection<Service> Services {get;set;} = [];
}

public enum ServiceCategoryType
{
    Technical,
    Construction,
    General
}