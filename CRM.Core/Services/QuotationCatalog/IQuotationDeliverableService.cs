using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationDeliverableService : IChildService<QuotationDeliverable, QuotationDeliverableResponseDto, CreateQuotationDeliverableDto>
{
    Task<IEnumerable<QuotationDeliverableResponseDto>> GetByServiceDeliverableIdAsync(int serviceDeliverableId);
    Task<IEnumerable<QuotationDeliverableResponseDto>> GetIncludedAsync(int quotationItemId);
}
