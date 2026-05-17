using CRM.Core.DTOs.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface INotificationService : IGeneralService<NotificationResponseDto, CreateNotificationDto, UpdateNotificationDto>
{
    Task<IEnumerable<NotificationResponseDto>> GetByUserAsync(int userId);
    Task<IEnumerable<NotificationResponseDto>> GetUnreadUserIdAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task MarkAllAsReadAsync(int userId);
}
