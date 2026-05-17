using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationRepository : IRepository<Quotation>
{
    Task<IEnumerable<Quotation>> GetByInquiryIdAsync(int inquiryId);
    Task<IEnumerable<Quotation>> GetByCustomerIdAsync(int custoemrId);
    Task<IEnumerable<Quotation>> GetByCompanyIdAsync(int companyId);
    Task<IEnumerable<Quotation>> GetByTechnicianIdAsync(int technicianId);
    Task<IEnumerable<Quotation>> GetByStatusAsync(QuotationStatus status);
    Task<Quotation?> GetWithItemsAsync(int id);
    Task<Quotation?> GetWithSnapshotsAsync(int id);
    Task<Quotation?> GetWithSignatureAsync(int id);
}
