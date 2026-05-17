namespace CRM.Core.Entities;

public class DeviceType
{
    public int Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ICollection<DeviceBrand> Brand {get;set;} = [];
}
