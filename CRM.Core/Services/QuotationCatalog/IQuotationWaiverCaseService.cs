using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationWaiverCaseService : IChildService<QuotationWaiverCase, QuotationWaiverCaseResponseDto, CreateQuotationWaiverCaseDto>
{
    Task<IEnumerable<QuotationWaiverCaseResponseDto>> GetByServiceWaiverCaseIdAsync(int serviceWaiverCaseId);
    Task<QuotationWaiverCaseResponseDto?> GetWithItemsAsync(int quotationItemId);
}
