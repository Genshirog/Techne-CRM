using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.InquiryCatalog;

public interface IInquiryService : IGeneralService<InquiryResponseDto, CreateInquiryDto, UpdateInquiryDto>
{
    Task<IEnumerable<InquiryResponseDto>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<InquiryResponseDto>> GetByGuestIdAsync(int guestId);
    Task<IEnumerable<InquiryResponseDto>> GetByCompanyIdAsync(int companyId);
    Task<IEnumerable<InquiryResponseDto>> GetByStatusAsync(InquiryStatus status);
    Task<InquiryResponseDto?> GetWithItemsAsync(int id);
}
