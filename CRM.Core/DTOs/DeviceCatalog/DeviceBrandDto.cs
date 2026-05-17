namespace CRM.Core.DTOs.DeviceCatalog;

public class BaseDeviceBrandDto
{
    public int DeviceTypeId {get;set;}
    public string Name {get;set;} = string.Empty;
}

public class CreateDeviceBrandDto : BaseDeviceBrandDto {}
public class UpdateDeviceBrandDto : BaseDeviceBrandDto
{
    public int Id {get;set;}
}

public class DeviceBrandResponseDto : BaseDeviceBrandDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
