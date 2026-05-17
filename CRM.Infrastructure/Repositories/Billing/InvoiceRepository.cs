using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.Billing;

public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(AppDbContext context) : base(context){}

    public async Task<Invoice?> GetByServiceAgreementIdAsync(int serviceAgreementId)
    {
        return await _dbSet.FirstOrDefaultAsync(i => i.ServiceAgreementId == serviceAgreementId);
    }

    public async Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status)
    {
        return await _dbSet.Where(i => i.Status == status).ToListAsync();
    }

    public async Task<Invoice?> GetWithPaymentsAsync(int id)
    {
        return await _dbSet.Include(i => i.Payments).FirstOrDefaultAsync(i => i.Id == id);
    }
}
