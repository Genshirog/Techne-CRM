using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class MessageRepository: ChildRepository<Message, int>, IMessageRepository
{
    public MessageRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<Message>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(m => m.ConversationId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<Message>> GetUnreadAsync(int conversationId)
    {
        return await _dbSet.Where(m => m.ConversationId == conversationId && m.IsRead == false).ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int conversationId)
    {
        return await _dbSet.Where(m => m.ConversationId == conversationId && m.IsRead == false).CountAsync();
    }

    public async Task MarkAllAsReadAsync(int conversationId)
    {
        await _dbSet.Where(m => m.ConversationId == conversationId && m.IsRead == false).ExecuteUpdateAsync(s => s.SetProperty(m => m.IsRead, true));
    }
}
