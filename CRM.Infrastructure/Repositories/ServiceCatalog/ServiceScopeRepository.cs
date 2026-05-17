using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceScopeRepository : ChildRepository<ServiceScope, int>
{
    public ServiceScopeRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceScope>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceId == parentId).ToListAsync();
    }
}
