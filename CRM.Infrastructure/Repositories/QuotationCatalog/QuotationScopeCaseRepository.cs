using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationScopeCaseRepository : ChildRepository<QuotationScopeCase, int>, IQuotationScopeCaseRepository
{
    public QuotationScopeCaseRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationScopeCase>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationScopeId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationScopeCase>> GetByServiceScopeCaseIdAsync(int serviceScopeCaseId)
    {
        return await _dbSet.Where(q => q.ServiceScopeCaseId == serviceScopeCaseId).ToListAsync();
    }

    public async Task<QuotationScopeCase?> GetWithItemsAsync(int id)
    {
        return await _dbSet.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }
}
