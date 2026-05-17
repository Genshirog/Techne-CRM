using CRM.Core.Entities;

namespace CRM.Core.Repositories.UserCatalog;

public interface ICompanyRepository : IRepository<Company>
{
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByNameAsync(string name);
}
