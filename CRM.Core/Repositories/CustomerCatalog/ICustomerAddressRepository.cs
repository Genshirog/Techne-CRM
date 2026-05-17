using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerCatalog;

public interface ICustomerAddressRepository : IRepository<CustomerAddress>
{
    Task<IEnumerable<CustomerAddress>> GetByCustomerIdAsync(int customerId); 
    Task<CustomerAddress?> GetDefaultByCustomerIdAsync (int customerId);
}
