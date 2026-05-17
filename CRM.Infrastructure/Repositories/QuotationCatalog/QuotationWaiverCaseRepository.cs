using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationWaiverCaseRepository : ChildRepository<QuotationWaiverCase, int>, IQuotationWaiverCaseRepository
{
    public QuotationWaiverCaseRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<QuotationWaiverCase>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(q => q.QuotationWaiverId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<QuotationWaiverCase>> GetByServiceWaiverCaseIdAsync(int serviceWaiverCaseId)
    {
        return await _dbSet.Where(q => q.ServiceWaiverCaseId == serviceWaiverCaseId).ToListAsync();
    }

    public async Task<QuotationWaiverCase?> GetWithItemsAsync(int id)
    {
        return await _dbSet.Include(q => q.Items).FirstOrDefaultAsync(q => q.Id == id);
    }
}
