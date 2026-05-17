using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationTermService : IChildService<QuotationTerm, QuotationTermResponseDto, CreateQuotationTermDto>
{
    Task<IEnumerable<QuotationTermResponseDto>> GetByServiceTermIdAsync(int serviceTermId);
    Task<IEnumerable<QuotationTermResponseDto>> GetIncludedAsync(int quotationItemId);
    Task<QuotationTermResponseDto?> GetWithItemsAsync(int id);
}
