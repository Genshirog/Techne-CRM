using CRM.Core.Entities;

namespace CRM.Core.Repositories.UserCatalog;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetByUserIdAsync(int userId);
    Task<IEnumerable<Customer>> GetAllWithUserAsync();
    Task<Customer?> GetByIdWithUserAsync(int id);
}
