using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.InquiryCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.InquiryCatalog;

[ApiController]
[Route("api/inquiry-item")]
public class InquiryItemController(IInquiryItemService service) : BaseChildController<InquiryItem, InquiryItemResponseDto, CreateInquiryItemDto>(service)
{
    [HttpGet("{serviceId}/service-category")]
    public async Task<IActionResult> GetByServiceCategoryId(int serviceId) => Ok(await service.GetByServiceCategoryIdAsync(serviceId));
    [HttpGet("{id}/technicial-detail")]
    public async Task<IActionResult> GetWithTechnicalDetail(int id) => Ok(await service.GetWithTechnicalDetailAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateInquiryItemDto dto)
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
