using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationWaiverCaseItemRepository : IChildRepository<QuotationWaiverCaseItem, int>
{
    Task<IEnumerable<QuotationWaiverCaseItem>> GetByServiceWaiverCaseItemIdAsync(int serviceWaiverCaseItemId);
}
