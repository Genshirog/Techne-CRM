using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class InquiryRepository : Repository<Inquiry>, IInquiryRepository
{
    public InquiryRepository(AppDbContext context) : base(context){}


    public override async Task<IEnumerable<Inquiry>> GetAllAsync()
    {
        return await _dbSet
            .Include(i => i.Customer).ThenInclude(c => c!.User)
            .Include(i => i.Customer).ThenInclude(c => c!.CustomerAddresses)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.ServiceCategory)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.InquiryTechnicalDetails).ThenInclude(td => td.Technician).ThenInclude(t => t!.User)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.InquiryTechnicalDetails).ThenInclude(td => td.Diagnoses)
            .Include(i => i.Guest)
            .ToListAsync();
    }

    public override async Task<Inquiry?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(i => i.Customer).ThenInclude(c => c!.User)
            .Include(i => i.Customer).ThenInclude(c => c!.CustomerAddresses)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.ServiceCategory)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.InquiryTechnicalDetails).ThenInclude(td => td.Technician).ThenInclude(t => t!.User)
            .Include(i => i.InquiryItems).ThenInclude(ii => ii.InquiryTechnicalDetails).ThenInclude(td => td.Diagnoses)
            .Include(i => i.Guest)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Inquiry>> GetByCompanyIdAsync(int companyId)
    {
        return await _dbSet
            .Include(i => i.Customer).ThenInclude(c => c!.User)
            .Where(i => i.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Inquiry>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(i => i.Customer).ThenInclude(c => c!.User)
            .Where(i => i.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Inquiry>> GetByGuestIdAsync(int guestId)
    {
        return await _dbSet.Where(i => i.GuestId == guestId).ToListAsync();
    }

    public async Task<IEnumerable<Inquiry>> GetByStatusdAsync(InquiryStatus status)
    {
        return await _dbSet.Where(i => i.Status == status).ToListAsync();
    }

    public async Task<Inquiry?> GetWithItemsAsync(int id)
    {
        return await _dbSet.Include(i => i.InquiryItems).FirstOrDefaultAsync(i => i.Id == id);
    }
}
