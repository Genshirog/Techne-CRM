using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class InquiryDiagnosisRepository : ChildRepository<InquiryDiagnosis, int>, IInquiryDiagnosisRepository
{
    public InquiryDiagnosisRepository(AppDbContext context) :base(context){}

    public async Task<IEnumerable<InquiryDiagnosis>> GetByDiagnosisCatalogIdAsync(int diagnosisCatalogId)
    {
        return await _dbSet.Where(i => i.DiagnosisCatalogId == diagnosisCatalogId).ToListAsync();
    }

    public override async Task<IEnumerable<InquiryDiagnosis>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(i => i.InquiryTechnicalDetailId == parentId).ToListAsync();
    }
}
