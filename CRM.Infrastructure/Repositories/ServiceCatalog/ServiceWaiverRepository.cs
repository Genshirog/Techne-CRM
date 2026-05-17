using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceWaiverRepository : ChildRepository<ServiceWaiver, int>
{
    public ServiceWaiverRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceWaiver>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceId == parentId).ToListAsync();
    }
}
