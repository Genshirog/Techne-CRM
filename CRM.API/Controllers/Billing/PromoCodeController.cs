using CRM.Core.DTOs.Billing;
using CRM.Core.Services.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace CRM.API.Controllers.Billing;

[ApiController]
[Route("api/promo-codes")]
public class PromoCodeController(IPromoCodeService service) : BaseController<PromoCodeResponseDto, CreatePromoCodeDto, UpdatedPromoCodeDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreatePromoCodeDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPut]
    public override async Task<IActionResult> Update(UpdatedPromoCodeDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [Authorize]
    [HttpGet("{name}")]
    public async Task<IActionResult> GetByCode(string code) => Ok(await service.GetByCodeAsync(code));
    
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("{id}/campaign")]
    public async Task<IActionResult> GetByCampaignId(int campaignId) => Ok(await service.GetByCampaignIdAsync(campaignId));
    
    [Authorize]
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveAsync() => Ok(await service.GetActiveAsync());
}
