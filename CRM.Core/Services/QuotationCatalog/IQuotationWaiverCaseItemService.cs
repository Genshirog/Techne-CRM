using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationWaiverCaseItemService : IChildService<QuotationWaiverCaseItem,QuotationWaiverCaseItemResponseDto, CreateQuotationWaiverCaseItemDto> 
{
    Task<IEnumerable<QuotationWaiverCaseItemResponseDto>> GetByServiceWaiverCaseItemIdAsync(int serviceWaiverCaseItemId);
}
