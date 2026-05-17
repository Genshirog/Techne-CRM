using CRM.Core.Entities;
namespace CRM.Core.Repositories.ServiceCatalog;

public interface IServiceCategoryRepository : IRepository<ServiceCategory>
{
    Task<bool> ExistByNameAsync(string name);
}
