namespace CRM.Core.DTOs.DeviceCatalog;

public class BaseDeviceModelDto
{
    public int DeviceBrandId {get;set;}
    public string Name {get;set;} = string.Empty;
}

public class CreateDeviceModelDto : BaseDeviceModelDto {}
public class UpdateDeviceModelDto : BaseDeviceModelDto
{
    public int Id {get;set;}
}

public class DeviceModelResponseDto : BaseDeviceModelDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
