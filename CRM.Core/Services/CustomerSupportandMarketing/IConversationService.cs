using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface IConversationService: IGeneralService<ConversationResponseDto, CreateConversationDto, UpdateConversationDto>
{
    Task<ConversationResponseDto?> GetByInquiryIdAsync(int inquiryId);
    Task<ConversationResponseDto?> GetByJobOrderIdAsync(int jobOrderId);
    Task<ConversationResponseDto?> GetWithMessageAsync(int id);
}
