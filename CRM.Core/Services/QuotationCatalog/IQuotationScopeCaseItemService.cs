using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationScopeCaseItemService : IChildService<QuotationScopeCaseItem, QuotationScopeCaseItemResponseDto, CreateQuotationScopeCaseItemDto>
{
    Task<IEnumerable<QuotationScopeCaseItemResponseDto>> GetByServiceScopeCaseItemIdAsync(int serviceScopeCaseItemId);
}
