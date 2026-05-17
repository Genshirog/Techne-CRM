using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[Authorize]
[ApiController]
[Route("api/message")]
public class MessageController(IMessageService service) : BaseChildController<Message, MessageResponseDto, CreateMessageDto>(service)
{
    [HttpGet("unread/{conversationId}")]
    public async Task<IActionResult> GetUnread(int conversationId) => Ok(await service.GetUnreadAsync(conversationId));
    [HttpGet("unread-count/{conversationId}")]
    public async Task<IActionResult> GetUnreadCount(int conversationId) => Ok(await service.GetUnreadCountAsync(conversationId));
    [HttpPatch("read-all/{conversationId}")]
    public async Task<IActionResult> MarkAllAsRead(int conversationId)
    {
        await service.MarkAllAsReadAsync(conversationId);
        return NoContent();
    }
}
