using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class TicketReplyService : ChildService<TicketReply, TicketReplyResponseDto, CreateTicketReplyDto>, ITicketReplyService
{
    private readonly ITicketRepliesRepository _repo;

    public TicketReplyService(ITicketRepliesRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<TicketReplyResponseDto>> GetBySenderUserIdAsync(int ticketId, int senderId)
    {
        var entities = await _repo.GetBySenderIdAsync(ticketId, senderId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override TicketReply MapToEntity(CreateTicketReplyDto dto) => new()
    {
        Attachment = dto.Attachment,
        Body = dto.Body,
        SenderId = dto.SenderId,
        TicketId = dto.TicketId
    };

    protected override TicketReplyResponseDto MapToResponse(TicketReply entity)
    {
        throw new NotImplementedException();
    }
}
