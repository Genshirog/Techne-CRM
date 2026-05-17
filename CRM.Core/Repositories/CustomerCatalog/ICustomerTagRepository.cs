using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerCatalog;

public interface ICustomerTagRepository:IRepository<CustomerTag>
{
    Task<IEnumerable<CustomerTag>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<CustomerTag>> GetByTagIdAsync(int tagId);
}
