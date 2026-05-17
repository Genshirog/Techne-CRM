using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationWaiverService : IChildService<QuotationWaiver, QuotationWaiverResponseDto, CreateQuotationWaiverDto>
{
    Task<IEnumerable<QuotationWaiverResponseDto>> GetByServiceWaiverIdAsync(int serviceWaiverId);
    Task<IEnumerable<QuotationWaiverResponseDto>> GetIncludedAsync(int quotationItemId);
    Task<QuotationWaiverResponseDto?> GetWithCaseAsync(int id);
    
}
