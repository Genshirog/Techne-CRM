using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class InquiryRepository : Repository<Inquiry>, IInquiryRepository
{
    public InquiryRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Inquiry>> GetByCompanyIdAsync(int companyId)
    {
        return await _dbSet.Where(i => i.CompanyId == companyId).ToListAsync();
    }

    public async Task<IEnumerable<Inquiry>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Where(i => i.CustomerId == customerId).ToListAsync();
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
