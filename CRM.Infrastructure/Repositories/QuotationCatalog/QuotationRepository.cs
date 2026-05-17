using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.QuotationCatalog;

public class QuotationRepository : Repository<Quotation>,IQuotationRepository
{
    public QuotationRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Quotation>> GetByCompanyIdAsync(int companyId)
    {
        return await _dbSet.Where(q => q.CompanyId == companyId).ToListAsync();
    }

    public async Task<IEnumerable<Quotation>> GetByCustomerIdAsync(int custoemrId)
    {
        return await _dbSet.Where(q => q.CustomerId == custoemrId).ToListAsync();
    }

    public async Task<IEnumerable<Quotation>> GetByInquiryIdAsync(int inquiryId)
    {
        return await _dbSet.Where(q => q.InquiryId == inquiryId).ToListAsync();
    }

    public async Task<IEnumerable<Quotation>> GetByStatusAsync(QuotationStatus status)
    {
        return await _dbSet.Where(q => q.Status == status).ToListAsync();
    }

    public async Task<IEnumerable<Quotation>> GetByTechnicianIdAsync(int technicianId)
    {
        return await _dbSet.Where(q => q.TechnicianId == technicianId).ToListAsync();
    }

    public async Task<Quotation?> GetWithItemsAsync(int id)
    {
        return await _dbSet.Include(q => q.QuotationItems).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<Quotation?> GetWithSignatureAsync(int id)
    {
        return await _dbSet.Include(q => q.Signature).FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<Quotation?> GetWithSnapshotsAsync(int id)
    {
        return await _dbSet.Include(q => q.QuotationClientSnapshot).FirstOrDefaultAsync(q => q.Id == id);
    }
}
