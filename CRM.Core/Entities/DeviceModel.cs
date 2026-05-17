namespace CRM.Core.Entities;

public class DeviceModel
{
    public int Id {get;set;}
    public int DeviceBrandId {get;set;}
    public string Name {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}
    
    public DeviceBrand DeviceBrand {get;set;} = null!;
    public ICollection<CustomerDevice> CustomerDevices {get;set;} = [];
}
