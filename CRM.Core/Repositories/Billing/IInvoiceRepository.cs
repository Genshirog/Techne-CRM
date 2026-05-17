using CRM.Core.Entities;

namespace CRM.Core.Repositories.Billing;

public interface IInvoiceRepository : IRepository<Invoice>
{
    Task <Invoice?> GetByServiceAgreementIdAsync(int serviceAgreementId);
    Task <IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status);
    Task <Invoice?> GetWithPaymentsAsync(int id);
}
