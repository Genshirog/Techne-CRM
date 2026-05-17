using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationScopeRepository : ChildRepository<QuotationScope, int>, IQuotationScopeRepository
{
    public QuotationScopeRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationScope>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationScope>> GetByServiceScopeIdAsync(int serviceScopeId)
    {
        return await _dbSet.Where(q => q.ServiceScopeId == serviceScopeId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationScope>> GetIncludedAsync(int quotationItemId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == quotationItemId && q.IsIncluded == true).ToListAsync();
    }

    public async Task<QuotationScope?> GetWithCasesAsync(int id)
    {
        return await _dbSet.Include(q => q.Cases).FirstOrDefaultAsync(q => q.Id == id);
    }
}
