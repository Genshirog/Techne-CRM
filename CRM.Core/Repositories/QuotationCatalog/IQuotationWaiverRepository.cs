using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationWaiverRepository : IChildRepository<QuotationWaiver, int>
{
    Task<IEnumerable<QuotationWaiver>> GetByServiceWaiverIdAsync(int serviceWaiverid);
    Task<IEnumerable<QuotationWaiver>> GetIncludedAsync(int quotationItemId);
    Task<QuotationWaiver?> GetWithCasesAsync(int id);
}
