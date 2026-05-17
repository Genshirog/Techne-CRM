using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface IDeviceBrandRepository : IRepository<DeviceBrand>
{
    Task<DeviceBrand?> GetByNameAsync(string name);
    Task<IEnumerable<DeviceBrand>> GetWithModelAsync();
}
