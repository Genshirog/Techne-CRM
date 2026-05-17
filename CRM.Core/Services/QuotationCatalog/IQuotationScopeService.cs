using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationScopeService : IChildService<QuotationScope,QuotationScopeResponseDto, CreateQuotationScopeDto>
{
    Task<IEnumerable<QuotationScopeResponseDto>> GetByServiceScopeIdAsync(int serviceScopeId);
    Task<IEnumerable<QuotationScopeResponseDto>> GetIncludedAsync(int quotationItemId);
    Task<QuotationScopeResponseDto?> GetWithCasesAsync(int id);
}
