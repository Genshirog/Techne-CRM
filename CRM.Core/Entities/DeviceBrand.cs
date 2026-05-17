namespace CRM.Core.Entities;

public class DeviceBrand
{
    public int Id {get;set;}
    public int DeviceTypeId {get;set;}
    public string Name {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public DeviceType DeviceType {get;set;} = null!;
    public ICollection<DeviceModel> Models {get;set;} = [];

}
