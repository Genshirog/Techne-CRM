using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface ITicketReplyService : IChildService<TicketReply, TicketReplyResponseDto, CreateTicketReplyDto>
{
    Task<IEnumerable<TicketReplyResponseDto>> GetBySenderUserIdAsync(int ticketId, int senderId);
}
