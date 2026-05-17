using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.JobOrderCatalog;

public class JobOrderRepository : Repository<JobOrder>, IJobOrderRepository
{
    public JobOrderRepository(AppDbContext context) : base(context){}

    public async Task<JobOrder?> GetByQuotationIdAsync(int quotationId)
    {
        return await _dbSet.Where(j => j.QuotationId == quotationId).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<JobOrder>> GetByStatusAsync(JobOrderStatus status)
    {
        return await _dbSet.Where(j => j.Status == status).ToListAsync();
    }

    public async Task<IEnumerable<JobOrder>> GetByTechnicianIdAsync(int technicianId)
    {
        return await _dbSet.Where(j => j.TechnicianId == technicianId).ToListAsync();
    }

    public async Task<JobOrder?> GetWithPartsAsync(int id)
    {
        return await _dbSet.Include(j => j.Parts).FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<JobOrder?> GetWithReportsAsync(int id)
    {
        return await _dbSet.Include(j => j.Reports).FirstOrDefaultAsync(j => j.Id == id);
    }
}
