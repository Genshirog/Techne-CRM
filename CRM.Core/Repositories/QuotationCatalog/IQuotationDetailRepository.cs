using CRM.Core.Entities;

namespace CRM.Core.Repositories.QuotationCatalog;

public interface IQuotationDetailRepository : IChildRepository<QuotationDetail, int>
{
    Task<decimal> GetTotalAmountAsync(int quotationItemId);
}
