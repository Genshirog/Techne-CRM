using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[Authorize]
[ApiController]
[Route("api/ticket-replies")]
public class TicketReplyController(ITicketReplyService service) : BaseChildController<TicketReply, TicketReplyResponseDto, CreateTicketReplyDto>(service)
{
    [HttpGet("{ticketId}/ticket-replies/{senderId}")]
    public async Task<IActionResult> GetBySenderUserId(int ticketId, int senderId) => Ok(await service.GetBySenderUserIdAsync(ticketId, senderId));
}
