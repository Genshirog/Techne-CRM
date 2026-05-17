using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceTermItemRepository : ChildRepository<ServiceTermItem,int>
{
    public ServiceTermItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceTermItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceTermId == parentId).ToListAsync();
    }
}
