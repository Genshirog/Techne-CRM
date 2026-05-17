using CRM.Core.DTOs.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public interface IDeviceModelService : IGeneralService<DeviceModelResponseDto, CreateDeviceModelDto, UpdateDeviceModelDto>
{
    Task<IEnumerable<DeviceModelResponseDto>> GetByBrandIdAsync(int brandId);
    Task<IEnumerable<DeviceModelResponseDto>> GetByDeviceTypeIdAsync(int deviceTypeId);
    Task<DeviceModelResponseDto?> GetByNameAsync(string name);
}
