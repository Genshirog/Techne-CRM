using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceScopeCaseRepository : ChildRepository<ServiceScopeCase, int>
{
    public ServiceScopeCaseRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceScopeCase>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceScopeId == parentId).ToListAsync();
    }
}
