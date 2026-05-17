using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationTermItemRepository : IChildRepository<QuotationTermItem, int>
{
    Task<IEnumerable<QuotationTermItem>> GetByServiceTermItemIdAsync(int serviceTermItemId);
}
