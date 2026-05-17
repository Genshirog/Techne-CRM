using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface ITicketRepliesRepository : IChildRepository<TicketReply, int>
{
    Task<IEnumerable<TicketReply>> GetBySenderIdAsync(int ticketId, int senderId);
}
