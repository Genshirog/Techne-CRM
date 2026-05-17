using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class MessageService : ChildService<Message, MessageResponseDto, CreateMessageDto>, IMessageService
{
    private readonly IMessageRepository _repo;

    public MessageService(IMessageRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<MessageResponseDto>> GetUnreadAsync(int conversationId)
    {
        var entities = await _repo.GetUnreadAsync(conversationId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<int> GetUnreadCountAsync(int conversationId)
    {
        return await _repo.GetUnreadCountAsync(conversationId);
    }

    public async Task MarkAllAsReadAsync(int conversationId)
    {
        await _repo.MarkAllAsReadAsync(conversationId);
    }

    protected override Message MapToEntity(CreateMessageDto dto) => new()
    {
        AttachmentName = dto.AttachmentName,
        AttachmentPath = dto.AttachmentPath,
        Body = dto.Body,
        ConversationId = dto.ConversationId,
        SenderId = dto.SenderId
    };

    protected override MessageResponseDto MapToResponse(Message entity) => new()
    {
        Id = entity.Id,
        AttachmentName = entity.AttachmentName,
        AttachmentPath = entity.AttachmentPath,
        Body = entity.Body,
        ConversationId = entity.ConversationId,
        SenderId = entity.SenderId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
