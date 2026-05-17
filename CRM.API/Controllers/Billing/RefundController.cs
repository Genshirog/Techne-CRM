using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Services.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.Billing;

[ApiController]
[Route("api/refund")]
public class RefundController(IRefundService service) : BaseChildController<Refund, RefundResponseDto, CreateRefundDto>(service)
{

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateRefundDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = (result as dynamic).Id}, result);
        
    }

    [NonAction]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("{paymentId}/payments")]
    public async Task<IActionResult> GetByPaymentId(int paymentId) => Ok(await service.GetByPaymentIdAsync(paymentId));
}
