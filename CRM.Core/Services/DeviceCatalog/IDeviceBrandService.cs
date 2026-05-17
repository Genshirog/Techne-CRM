using CRM.Core.DTOs.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public interface IDeviceBrandService : IGeneralService<DeviceBrandResponseDto, CreateDeviceBrandDto, UpdateDeviceBrandDto>
{
    Task<DeviceBrandResponseDto?> GetByNameAsync(string name);
    Task<IEnumerable<DeviceBrandResponseDto>> GetWithModelAsync();
}
