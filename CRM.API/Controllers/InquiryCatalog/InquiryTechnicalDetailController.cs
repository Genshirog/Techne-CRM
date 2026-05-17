using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.InquiryCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.InquiryCatalog;

[ApiController]
[Route("api/inquiry-technicial-detail")]
public class InquiryTechnicalDetailController(IInquiryTechnicalDetailService service) : BaseChildController<InquiryTechnicalDetail, InquiryTechnicalDetailResponseDto, CreateInquiryTechnicalDetailDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{customerId}/customer-device")]
    public async Task<IActionResult> GetByCustomerDeviceId(int customerId) => Ok(await service.GetByCustomerDeviceIdAsync(customerId));
    [HttpGet("{id}/diagnosis")]
    public async Task<IActionResult> GetWithDiagnoses(int id) => Ok(await service.GetWithDiagnosesAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateInquiryTechnicalDetailDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = (result as dynamic).Id}, result);
        
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
