using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceTermRepository : ChildRepository<ServiceTerm, int>
{
    public ServiceTermRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceTerm>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceId == parentId).ToListAsync();
    }
}
