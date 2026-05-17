using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId)
    {
        return await _dbSet.Where(n => n.UserId == userId).ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(int userId)
    {
        return await _dbSet.Where(n => n.UserId == userId && n.IsRead == false).ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _dbSet.Where(n => n.UserId == userId && n.IsRead == false).CountAsync();
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _dbSet.Where(n => n.UserId == userId && n.IsRead == false).ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead,true));
    }
}
