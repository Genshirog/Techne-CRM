using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[Authorize(Roles ="Admin,SuperAdmin")]
[ApiController]
[Route("api/campaigns")]
public class CampaignController(ICampaignService service) : BaseController<CampaignResponseDto, CreateCampaignDto, UpdateCampaignDto>(service)
{
    
    [HttpGet("{status}")]
    public async Task<IActionResult> GetByStatus(CampaignStatus status)
    {
        var result = await service.GetByStatusAsync(status);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("channels/{channel}")]
    public async Task<IActionResult> GetByChannel(CampaignChannel channel)
    {
        var result = await service.GetByChannelAsync(channel);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("target/{id}")]
    public async Task<IActionResult> GetWithTarget(int id) => Ok(await service.GetWithTargetAsync(id));
    [HttpGet("promo-codes/{id}")]
    public async Task<IActionResult> GetWithPromoCodes(int id) => Ok(await service.GetWithPromoCodesAsync(id));
}
