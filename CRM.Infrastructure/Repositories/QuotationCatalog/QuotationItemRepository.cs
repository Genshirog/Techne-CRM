using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationItemRepository : ChildRepository<QuotationItem, int>, IQuotationItemRepository
{
    public QuotationItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationItem>> GetByServiceIdAsync(int serviceId)
    {
        return await _dbSet.Where(q => q.ServiceId == serviceId).ToListAsync();
    }

    public async Task<QuotationItem?> GetWithDeliverablesAsync(int id)
    {
        return await _dbSet.Include(q => q.Deliverables).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<QuotationItem?> GetWithDetailAsync(int id)
    {
        return await _dbSet.Include(q => q.Details).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<QuotationItem?> GetWithScopesAsync(int id)
    {
        return await _dbSet.Include(q => q.Scopes).ThenInclude(q => q.Cases).ThenInclude(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<QuotationItem?> GetWithTermsAsync(int id)
    {
        return await _dbSet.Include(q => q.Terms).ThenInclude(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<QuotationItem?> GetWithWaiversAsync(int id)
    {
        return await _dbSet.Include(q => q.Waivers).ThenInclude(q => q.Cases).ThenInclude(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }
}
