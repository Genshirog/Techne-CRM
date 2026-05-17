using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationTermRepository : IChildRepository<QuotationTerm, int>
{
    Task<IEnumerable<QuotationTerm>> GetByServiceTermIdAsync(int serviceTermId);
    Task<IEnumerable<QuotationTerm>> GetIncludedAsync(int quotationItemId);
    Task<QuotationTerm?> GetWithItemsAsync(int id);
}
