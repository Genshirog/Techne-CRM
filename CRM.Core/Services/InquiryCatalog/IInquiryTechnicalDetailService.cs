using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.InquiryCatalog;

public interface IInquiryTechnicalDetailService : IChildService<InquiryTechnicalDetail, InquiryTechnicalDetailResponseDto, CreateInquiryTechnicalDetailDto>
{
    Task<IEnumerable<InquiryTechnicalDetailResponseDto>> GetByCustomerDeviceIdAsync(int customerId);
    Task<InquiryTechnicalDetailResponseDto?> GetWithDiagnosesAsync(int id);
    Task<InquiryTechnicalDetailResponseDto> AssignTechnicianAsync(int id, AssignTechnicianDto dto);
}
