using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationTermItemService : IChildService<QuotationTermItem, QuotationTermItemResponseDto, CreateQuotationTermItemDto>
{
    Task<IEnumerable<QuotationTermItemResponseDto>> GetByServiceTermItemIdAsync(int serviceTermItemId);
}
