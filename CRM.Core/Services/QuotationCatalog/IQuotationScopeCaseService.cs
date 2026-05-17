using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationScopeCaseService : IChildService<QuotationScopeCase, QuotationScopeCaseResponseDto, CreateQuotationScopeCaseDto>
{
    Task<IEnumerable<QuotationScopeCaseResponseDto>> GetByServiceScopeCaseIdAsync(int serviceScopeCaseId);
    Task<QuotationScopeCaseResponseDto?> GetWithItemsAsync(int id);
}
