using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationScopeRepository : IChildRepository<QuotationScope, int>
{
    Task<IEnumerable<QuotationScope>> GetByServiceScopeIdAsync(int serviceScopeId);
    Task<IEnumerable<QuotationScope>> GetIncludedAsync(int quotationItemId);
    Task<QuotationScope?> GetWithCasesAsync(int id);
}
