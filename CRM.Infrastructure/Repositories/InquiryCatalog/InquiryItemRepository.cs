using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class InquiryItemRepository : ChildRepository<InquiryItem, int>, IInquiryItemRepository
{
    public InquiryItemRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<InquiryItem>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(i => i.InquiryId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<InquiryItem>> GetByServiceCategoryIdAsync(int serviceCategoryId)
    {
        return await _dbSet.Where(d => d.ServiceCategoryId == serviceCategoryId).ToListAsync();
    }

    public async Task<InquiryItem?> GetWithTechnicalDetailsAsync(int id)
    {
        return await _dbSet.Include(d => d.InquiryTechnicalDetails).FirstOrDefaultAsync(d => d.Id == id);
    }
}
