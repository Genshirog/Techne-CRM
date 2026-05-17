using CRM.Core.Entities;

namespace CRM.Core.Repositories.ServiceAgreementCatalog;

public interface IServiceAgreementRepository : IRepository<ServiceAgreement>
{
    Task<ServiceAgreement?> GetByJobOrderIdAsync(int jobOrderId);
    Task<ServiceAgreement?> GetByQuotationIdAsync(int quotationId);
    Task<IEnumerable<ServiceAgreement>> GetByStatusAsync(ServiceAgreementStatus status);
    Task<ServiceAgreement?> GetWithSignatureAsync(int id);


}
