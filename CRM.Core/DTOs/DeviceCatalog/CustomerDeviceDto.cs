namespace CRM.Core.DTOs.DeviceCatalog;

public class BaseCustomerDeviceDto
{
    public int CustomerId {get;set;}
    public int DeviceModelId {get;set;}
    public string SerialNumber {get;set;} = string.Empty;
    public DateTime? PurchaseTime {get;set;}
}

public class CreateCustomerDeviceDto : BaseCustomerDeviceDto {}
public class UpdateCustomerDeviceDto : BaseCustomerDeviceDto
{
    public int Id {get;set;}
}

public class CustomerDeviceResponseDto : BaseCustomerDeviceDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
