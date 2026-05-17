using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationScopeCaseItemRepository : IChildRepository<QuotationScopeCaseItem, int>
{
    Task<IEnumerable<QuotationScopeCaseItem>> GetByServiceScopeCaseItemIdAsync(int serviceScopeCaseItemId);
}
