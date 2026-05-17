using CRM.Core.Entities;
namespace CRM.Core.Repositories.ServiceCatalog;

public interface IServiceRepository : IRepository<Service>
{
    Task<IEnumerable<Service>> GetAllWithCategoryAsync();
    Task<Service?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Service>> GetAllByCategoryIdAsync(int id);
}
