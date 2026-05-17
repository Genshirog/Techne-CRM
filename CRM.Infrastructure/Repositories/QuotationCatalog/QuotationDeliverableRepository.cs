using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationDeliverableRepository : ChildRepository<QuotationDeliverable, int>, IQuotationDeliverableRepository
{
    public QuotationDeliverableRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationDeliverable>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationDeliverable>> GetByServiceDeliverableIdAsync(int serviceDeliverableId)
    {
        return await _dbSet.Where(q => q.ServiceDeliverableId == serviceDeliverableId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationDeliverable>> GetIncludedAsync(int quotationItemId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == quotationItemId && q.IsIncluded == true).ToListAsync();
    }
}
