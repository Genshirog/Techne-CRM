using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationDetailService : IChildService<QuotationDetail, QuotationDetailResponseDto, CreateQuotationDetailDto>
{
    Task<decimal> GetTotalAmountAsync(int quotationItemId);
}
