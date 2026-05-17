using CRM.Core.DTOs.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public interface IDeviceTypeService : IGeneralService<DeviceTypeResponseDto, CreateDeviceTypeDto, UpdateDeviceTypeDto>
{
    Task<DeviceTypeResponseDto?> GetByNameAsync(string name);
    Task<IEnumerable<DeviceTypeResponseDto>> GetWithModelAsync();
}
