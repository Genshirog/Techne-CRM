using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Services.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.Billing;

[ApiController]
[Route("api/invoices")]
public class InvoiceController(IInvoiceService service) : BaseController<InvoiceResponseDto,CreateInvoiceDto, UpdateInvoiceDto>(service)
{
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpGet]
    public override async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    public override async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateInvoiceDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPut]
    public override async Task<IActionResult> Update(UpdateInvoiceDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(InvoiceStatus status) => Ok(await service.GetByStatusAsync(status));

    [Authorize(Roles ="Admin,SuperAdmin,Customer")]
    [HttpGet("{id}/payments")]
    public async Task<IActionResult> GetWithPayments(int id)
    {
        var result = await service.GetWithPaymentsAsync(id);
        return result == null ? NotFound() : Ok(result);
    }
}
