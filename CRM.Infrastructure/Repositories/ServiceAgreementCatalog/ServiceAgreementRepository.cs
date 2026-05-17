using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceAgreementCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.ServiceAgreementCatalog;

public class ServiceAgreementRepository : Repository<ServiceAgreement>, IServiceAgreementRepository
{
    public ServiceAgreementRepository(AppDbContext context) : base(context){}

    public async Task<ServiceAgreement?> GetByJobOrderIdAsync(int jobOrderId)
    {
        return await _dbSet.Where(s => s.JobOrderId == jobOrderId).FirstOrDefaultAsync();
    }

    public async Task<ServiceAgreement?> GetByQuotationIdAsync(int quotationId)
    {
        return await _dbSet.Where(s => s.QuotationId == quotationId).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ServiceAgreement>> GetByStatusAsync(ServiceAgreementStatus status)
    {
        return await _dbSet.Where(s => s.Status == status).ToListAsync();
    }

    public async Task<ServiceAgreement?> GetWithSignatureAsync(int id)
    {
        return await _dbSet.Include(s => s.Signature).FirstOrDefaultAsync(s => s.Id == id);
    }
}
