using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Services.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.Billing;

[ApiController]
[Route("api/payments")]
public class PaymentController(IPaymentService service) : BaseChildController<Payment, PaymentResponseDto, CreatePaymentDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpGet("parent/{parentId}")]
    public override async Task<IActionResult> GetByParentId(int parentId) => Ok(await service.GetByParentIdAsync(parentId));

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreatePaymentDto dto)
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

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("{id}/with-refund")]
    public async Task<IActionResult> GetWithRefund(int id)
    {
        var result = await service.GetWithRefundAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("by-stage")]
    public async Task<IActionResult> GetByStage(int invoiceId, PaymentStage stage)
    {
        var result = await service.GetByStageAsync(invoiceId, stage);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("total-paid")]
    public async Task<IActionResult> GetTotalPaid(int invoiceId) => Ok(await service.GetTotalPaidAsync(invoiceId));
}
