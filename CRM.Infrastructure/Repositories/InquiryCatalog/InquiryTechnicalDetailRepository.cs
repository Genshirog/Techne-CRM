using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class InquiryTechnicalDetailRepository : Repository<InquiryTechnicalDetail>, IInquiryTechnicialDetailRepository
{
    public InquiryTechnicalDetailRepository(AppDbContext context) : base(context){}

    public async Task<InquiryTechnicalDetail?> AssignTechnicianAsync(int id, int technicianId)
    {
        var entity = await _dbSet.Include(i => i.Technician).FirstOrDefaultAsync(i => i.Id == id);
        if (entity is null) return null;
        
        entity.TechnicianId = technicianId;
        return entity;
    }

    public async Task<IEnumerable<InquiryTechnicalDetail>> GetByCustomerDeviceIdAsync(int customerId)
    {
        return await _dbSet.Where(i => i.CustomerDeviceId == customerId).ToListAsync();
    }

    public async Task<IEnumerable<InquiryTechnicalDetail>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(i => i.InquryItemId == parentId).ToListAsync();
    }

    public async Task<InquiryTechnicalDetail?> GetWithDiagnosesAsync(int id)
    {
        return await _dbSet.Include(i => i.Diagnoses).FirstOrDefaultAsync(i => i.Id == id);
    }

}
