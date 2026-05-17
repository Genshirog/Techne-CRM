using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface IMessageService:IChildService<Message, MessageResponseDto, CreateMessageDto>
{
    Task<IEnumerable<MessageResponseDto>> GetUnreadAsync(int conversationId);
    Task<int> GetUnreadCountAsync(int conversationId);
    Task MarkAllAsReadAsync(int conversationId);
}