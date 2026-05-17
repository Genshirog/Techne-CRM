using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.InquiryCatalog;

public interface IInquiryItemService : IChildService<InquiryItem, InquiryItemResponseDto, CreateInquiryItemDto>
{
    Task<IEnumerable<InquiryItemResponseDto>> GetByServiceCategoryIdAsync(int serviceId);
    Task<InquiryItemResponseDto?> GetWithTechnicalDetailAsync(int id);
}
