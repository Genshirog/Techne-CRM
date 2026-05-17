using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface IDeviceTypeRepository : IRepository<DeviceType>
{
    Task<DeviceType?> GetByNameAsync(string name);
    Task<IEnumerable<DeviceType>> GetWithModelAsync();
}
