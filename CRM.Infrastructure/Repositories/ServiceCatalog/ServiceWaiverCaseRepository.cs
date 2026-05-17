using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceWaiverCaseRepository : ChildRepository<ServiceWaiverCase,int> 
{
    public ServiceWaiverCaseRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<ServiceWaiverCase>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(s => s.ServiceWaiverId == parentId).ToListAsync();
    }
}
