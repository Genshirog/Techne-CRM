using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationTermRepository: ChildRepository<QuotationTerm, int>, IQuotationTermRepository
{
    public QuotationTermRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationTerm>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationTerm>> GetByServiceTermIdAsync(int serviceTermId)
    {
        return await _dbSet.Where(q => q.ServiceTermId == serviceTermId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationTerm>> GetIncludedAsync(int quotationItemId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == quotationItemId && q.IsIncluded == true).ToListAsync();
    }

    public async Task<QuotationTerm?> GetWithItemsAsync(int id)
    {
        return await _dbSet.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }
}
