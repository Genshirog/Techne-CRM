using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationScopeCaseItemRepository : ChildRepository<QuotationScopeCaseItem, int>, IQuotationScopeCaseItemRepository
{
    public QuotationScopeCaseItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationScopeCaseItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationScopeCaseId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationScopeCaseItem>> GetByServiceScopeCaseItemIdAsync(int serviceScopeCaseItemId)
    {
        return await _dbSet.Where(q => q.ServiceScopeCaseItemId == serviceScopeCaseItemId).ToListAsync();
    }
}
