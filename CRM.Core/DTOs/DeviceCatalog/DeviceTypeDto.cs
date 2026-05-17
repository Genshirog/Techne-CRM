namespace CRM.Core.DTOs.DeviceCatalog;

public class BaseDeviceTypeDto
{
    public string Name {get;set;} = string.Empty;
}

public class CreateDeviceTypeDto :BaseDeviceTypeDto{}
public class UpdateDeviceTypeDto : BaseDeviceTypeDto
{
    public int Id {get;set;}
}

public class DeviceTypeResponseDto : BaseDeviceTypeDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
}
