using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationWaiverRepository: ChildRepository<QuotationWaiver, int>,  IQuotationWaiverRepository
{
    public QuotationWaiverRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationWaiver>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationWaiver>> GetByServiceWaiverIdAsync(int serviceWaiverid)
    {
        return await _dbSet.Where(q => q.ServiceWaiverId == serviceWaiverid).ToListAsync();
    }

    public async Task<IEnumerable<QuotationWaiver>> GetIncludedAsync(int quotationItemId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == quotationItemId && q.IsIncluded == true).ToListAsync();
    }

    public async Task<QuotationWaiver?> GetWithCasesAsync(int id)
    {
        return await _dbSet.Include(q => q.Cases).FirstOrDefaultAsync(q => q.Id == id);
    }
}
