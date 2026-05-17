using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.InquiryCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.InquiryCatalog;


[ApiController]
[Route("api/inquiries")]
public class InquiryController(IInquiryService service) : BaseController<InquiryResponseDto, CreateInquiryDto, UpdateInquiryDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{customerId}/customer")]
    public async Task<IActionResult> GetByCustomerId(int customerId) => Ok(await service.GetByCustomerIdAsync(customerId));
    [HttpGet("{guestId}/guest")]

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    public async Task<IActionResult> GetByGuestId(int guestId) => Ok(await service.GetByGuestIdAsync(guestId));
    [HttpGet("{companyId}/company")]

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    public async Task<IActionResult> GetByCompanyId(int companyId) => Ok(await service.GetByCompanyIdAsync(companyId));
    [HttpGet("{status}/inquiry-status")]

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    public async Task<IActionResult> GetByStatus(InquiryStatus status) => Ok(await service.GetByStatusAsync(status));
    [HttpGet("{id}/inquiry-items")]
    public async Task<IActionResult> GetWithItems(int id) => Ok(await service.GetWithItemsAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateInquiryDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
