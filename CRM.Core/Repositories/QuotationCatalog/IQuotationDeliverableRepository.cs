using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationDeliverableRepository : IChildRepository<QuotationDeliverable,int>
{
    Task<IEnumerable<QuotationDeliverable>> GetByServiceDeliverableIdAsync(int serviceDeliverableId);
    Task<IEnumerable<QuotationDeliverable>> GetIncludedAsync(int quotationItemId);
}
