using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface IMessageRepository : IChildRepository<Message, int>
{
    Task<IEnumerable<Message>> GetUnreadAsync(int conversationId);
    Task<int> GetUnreadCountAsync(int conversationId);
    Task MarkAllAsReadAsync(int conversationId);
}
