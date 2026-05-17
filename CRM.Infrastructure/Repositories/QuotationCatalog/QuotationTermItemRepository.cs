using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationTermItemRepository : ChildRepository<QuotationTermItem, int>, IQuotationTermItemRepository
{
    public QuotationTermItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationTermItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationTermId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationTermItem>> GetByServiceTermItemIdAsync(int serviceTermItemId)
    {
        return await _dbSet.Where(q => q.ServiceTermItemId == serviceTermItemId).ToListAsync();
    }
}
