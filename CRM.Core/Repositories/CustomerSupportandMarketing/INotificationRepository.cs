using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface INotificationRepository : IRepository<Notification>
{
    Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task MarkAllAsReadAsync(int userId);
}
