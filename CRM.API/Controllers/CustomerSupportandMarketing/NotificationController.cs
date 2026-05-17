using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[Authorize]
[ApiController]
[Route("api/notifications")]
public class NotificationController(INotificationService service) : BaseController<NotificationResponseDto, CreateNotificationDto, UpdateNotificationDto>(service)
{
    [HttpGet("{userId}/user")]
    public async Task<IActionResult> GetByUser(int userId) => Ok(await service.GetByUserAsync(userId));
    [HttpGet("{userId}/unread")]
    public async Task<IActionResult> GetUnreadUserId(int userId) => Ok(await service.GetUnreadUserIdAsync(userId));
    [HttpGet("{userId}/unread-count")]
    public async Task<IActionResult> GetUnreadCount(int userId) => Ok(await service.GetUnreadCountAsync(userId));
    [HttpGet("{userId}/read-all")]
    public async Task<IActionResult> MarkAllAsRead(int userId)
    {
        await service.MarkAllAsReadAsync(userId);
        return NoContent();
    }
}
