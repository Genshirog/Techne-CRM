using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationWaiverCaseItemRepository : ChildRepository<QuotationWaiverCaseItem, int>, IQuotationWaiverCaseItemRepository
{
    public QuotationWaiverCaseItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationWaiverCaseItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationWaiverCaseId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationWaiverCaseItem>> GetByServiceWaiverCaseItemIdAsync(int serviceWaiverCaseItemId)
    {
        return await _dbSet.Where(q => q.ServiceWaiverCaseItemId == serviceWaiverCaseItemId).ToListAsync();
    }
}
