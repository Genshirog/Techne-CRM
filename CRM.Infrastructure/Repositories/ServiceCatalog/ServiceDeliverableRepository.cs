using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceDeliverableRepository : ChildRepository<ServiceDeliverable, int>
{
    public ServiceDeliverableRepository(AppDbContext context): base(context){}

    public override async Task<IEnumerable<ServiceDeliverable>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceId == parentId).ToListAsync();
    }
}
