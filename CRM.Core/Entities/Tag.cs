namespace CRM.Core.Entities;

public class Tag
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty; //VIP, Frequent
    public string Color {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public ICollection<CustomerTag> CustomerTags {get;set;} = [];
}
