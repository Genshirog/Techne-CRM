using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerCatalog;

public interface ICustomerNoteRepository:IRepository<CustomerNote>
{
    Task<IEnumerable<CustomerNote>> GetByCustomerIdAsync(int customerId); 
    Task<IEnumerable<CustomerNote>> SearchByContentAsync(string keyword);
}
