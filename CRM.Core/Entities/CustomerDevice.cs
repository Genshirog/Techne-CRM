namespace CRM.Core.Entities;

public class CustomerDevice
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public int DeviceModelId {get;set;}
    public string SerialNumber {get;set;} = string.Empty;
    public DateTime? PurchaseTime {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Customer Customer {get;set;} = null!;
    public DeviceModel DeviceModel {get;set;} = null!;
}
