using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.JobOrderCatalog;

public class JobOrderPartRepository : ChildRepository<JobOrderPart, int>, IJobOrderPartRepository
{
    public JobOrderPartRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<JobOrderPart>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(j => j.JobOrderId == parentId).ToListAsync();
    }

    public async Task<decimal> GetTotalPartsAmountAsync(int jobOrderId)
    {
        return await _dbSet.Where(j => j.JobOrderId == jobOrderId).SumAsync(j => j.Quantity * j.UnitPrice);
    }
}
