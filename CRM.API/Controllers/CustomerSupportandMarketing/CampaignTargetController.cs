using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[Authorize(Roles ="Admin,SuperAdmin")]
[ApiController]
[Route("api/campaign-targets")]
public class CampaignTargetController(ICampaignTargetService service) : BaseChildController<CampaignTarget, CampaignTargetResponseDto, CreateCampaignTargetDto>(service)
{
    [HttpGet("{campaignId}/unsent")]
    public async Task<IActionResult> GetUnsent(int campaignId) => Ok(await service.GetUnsentAsync(campaignId));
    [HttpGet("{customerId}")]
    public async Task<IActionResult> GetByCustomerId(int customerId) => Ok(await service.GetByCustomerIdAsync(customerId));
}
