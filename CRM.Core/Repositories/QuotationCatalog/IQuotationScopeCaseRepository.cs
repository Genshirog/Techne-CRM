using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationScopeCaseRepository : IChildRepository<QuotationScopeCase, int>
{
    Task<IEnumerable<QuotationScopeCase>> GetByServiceScopeCaseIdAsync(int serviceScopeCaseId);
    Task<QuotationScopeCase?> GetWithItemsAsync(int id);
}
