using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class TicketReplyRepository : ChildRepository<TicketReply, int>, ITicketRepliesRepository
{
    public TicketReplyRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<TicketReply>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(t => t.TicketId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<TicketReply>> GetBySenderIdAsync(int ticketId, int senderId)
    {
        return await _dbSet.Where(t => t.SenderId == senderId && t.TicketId == ticketId).ToListAsync();
    }
}
