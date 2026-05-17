using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationItemRepository : IChildRepository<QuotationItem,int>
{
    Task<IEnumerable<QuotationItem>> GetByServiceIdAsync(int serviceId);
    Task<QuotationItem?> GetWithScopesAsync(int id);
    Task<QuotationItem?> GetWithWaiversAsync(int id);
    Task<QuotationItem?> GetWithTermsAsync(int id);
    Task<QuotationItem?> GetWithDeliverablesAsync(int id);
    Task<QuotationItem?> GetWithDetailAsync(int id);
}
