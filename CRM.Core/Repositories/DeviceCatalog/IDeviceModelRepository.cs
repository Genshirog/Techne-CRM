using CRM.Core.Entities;

namespace CRM.Core.Repositories.DeviceCatalog;

public interface IDeviceModelRepository : IRepository<DeviceModel>
{
    Task<IEnumerable<DeviceModel>> GetByBrandIdAsync(int brandId);
    Task<IEnumerable<DeviceModel>> GetByDeviceTypeIdAsync(int deviceTypeId);
    Task<DeviceModel?> GetByNameAsync(string name);
}
