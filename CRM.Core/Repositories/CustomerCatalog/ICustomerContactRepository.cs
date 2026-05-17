using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerCatalog;

public interface ICustomerContactRepository:IRepository<CustomerContact>
{
    Task<IEnumerable<CustomerContact>> GetByCustomerIdAsync(int customerId); 
}
