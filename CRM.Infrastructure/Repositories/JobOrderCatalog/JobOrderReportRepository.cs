using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.JobOrderCatalog;

public class JobOrderReportRepository: ChildRepository<JobOrderReport, int>, IJobOrderReportRepository
{
    public JobOrderReportRepository(AppDbContext context) :base(context){}

    public override async Task<IEnumerable<JobOrderReport>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(j => j.JobOrderId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<JobOrderReport>> GetByQuotationItemIdAsync(int quotationItemId)
    {
        return await _dbSet.Where(j => j.QuotationItemId == quotationItemId).ToListAsync();
    }
}
