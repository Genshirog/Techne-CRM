using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationWaiverCaseRepository : IChildRepository<QuotationWaiverCase, int>
{
    Task<IEnumerable<QuotationWaiverCase>> GetByServiceWaiverCaseIdAsync(int serviceWaiverCaseId);
    Task<QuotationWaiverCase?> GetWithItemsAsync(int id);
}
