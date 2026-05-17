using CRM.Core.Entities;

namespace CRM.Core.Repositories.InquiryCatalog;

public interface IInquiryDiagnosisRepository : IChildRepository<InquiryDiagnosis, int>
{
    Task<IEnumerable<InquiryDiagnosis>> GetByDiagnosisCatalogIdAsync(int diagnosisCatalogId);
}
