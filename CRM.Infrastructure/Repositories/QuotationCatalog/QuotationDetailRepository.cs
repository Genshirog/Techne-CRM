using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationDetailRepository : ChildRepository<QuotationDetail, int>, IQuotationDetailRepository
{
    public QuotationDetailRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationDetail>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == parentId).ToListAsync();
    }

    public async Task<decimal> GetTotalAmountAsync(int quotationItemId)
    {
        return await _dbSet.Where(q => q.QuotationItemId == quotationItemId).SumAsync(q => q.UnitPrice * q.Quantity);
    }
}
