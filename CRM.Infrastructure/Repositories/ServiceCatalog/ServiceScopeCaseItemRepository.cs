using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceScopeCaseItemRepository : ChildRepository<ServiceScopeCaseItem, int>
{
    public ServiceScopeCaseItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceScopeCaseItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceScopeCaseId == parentId).ToListAsync();
    }
}
