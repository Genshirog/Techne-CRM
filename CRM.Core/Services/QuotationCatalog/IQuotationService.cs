using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.QuotationCatalog;

public interface IQuotationService : IGeneralService<QuotationResponseDto, CreateQuotationDto, UpdateQuotationDto>
{
    Task<IEnumerable<QuotationResponseDto>> GetByInquiryIdAsync(int inquiryId);
    Task<IEnumerable<QuotationResponseDto>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<QuotationResponseDto>> GetByCompanyIdAsync(int companyId);
    Task<IEnumerable<QuotationResponseDto>> GetByTechnicianIdAsync(int technicianId);
    Task<IEnumerable<QuotationResponseDto>> GetByStatusAsync(QuotationStatus status);
    Task<QuotationResponseDto?> GetWithItemsAsync(int id);
    Task<QuotationResponseDto?> GetWithSnapshotAsync(int id);
    Task<QuotationResponseDto?> GetWithSignatureAsync(int id);
}
