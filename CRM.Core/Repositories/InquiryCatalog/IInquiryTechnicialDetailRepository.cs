using CRM.Core.Entities;

namespace CRM.Core.Repositories.InquiryCatalog;

public interface IInquiryTechnicialDetailRepository : IChildRepository<InquiryTechnicalDetail, int>
{
    Task<IEnumerable<InquiryTechnicalDetail>> GetByCustomerDeviceIdAsync(int customerId);
    Task<InquiryTechnicalDetail?> GetWithDiagnosesAsync(int id);
}
