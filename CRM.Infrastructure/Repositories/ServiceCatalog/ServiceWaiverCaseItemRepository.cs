using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceWaiverCaseItemRepository : ChildRepository<ServiceWaiverCaseItem, int>
{
    public ServiceWaiverCaseItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceWaiverCaseItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceWaiverCaseId == parentId).ToListAsync();
    }
}
