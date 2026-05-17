using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceCatalog;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceCategoryRepository : Repository<ServiceCategory>, IServiceCategoryRepository
{
    public ServiceCategoryRepository(AppDbContext context) :base(context){}

    public async Task<bool> ExistByNameAsync(string name)
    {
        return await _dbSet.AnyAsync(c => c.Name == name);
    } 
}
