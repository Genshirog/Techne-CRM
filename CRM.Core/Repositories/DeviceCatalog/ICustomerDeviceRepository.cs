using CRM.Core.Entities;

namespace CRM.Core.Repositories.DeviceCatalog;

public interface ICustomerDeviceRepository : IRepository<CustomerDevice>
{
    Task<IEnumerable<CustomerDevice>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<CustomerDevice>> GetByDeviceModelAsync(int deviceId);
    Task<CustomerDevice?> GetWithDetailsAsync(int id);
}
