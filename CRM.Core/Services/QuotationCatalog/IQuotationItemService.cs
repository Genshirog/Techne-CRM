using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationItemService : IChildService<QuotationItem, QuotationItemResponseDto, CreateQuotationItemDto>
{
    Task<IEnumerable<QuotationItemResponseDto>> GetByServiceIdAsync(int serviceId);
    Task<QuotationItemResponseDto?> GetWithScopesAsync(int id);
    Task<QuotationItemResponseDto?> GetWithWaiversAsync(int id);
    Task<QuotationItemResponseDto?> GetWithTermsAsync(int id);
    Task<QuotationItemResponseDto?> GetWithDeliverablesAsync(int id);
    Task<QuotationItemResponseDto?> GetWithDetailsAsync(int id);
}
