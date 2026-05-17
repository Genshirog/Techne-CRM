using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Services.DeviceCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.DeviceCatalog;

[Authorize]
[ApiController]
[Route("api/customer-devices")]
public class CustomerDeviceController(ICustomerDeviceService service) : BaseController<CustomerDeviceResponseDto, CreateCustomerDeviceDto, UpdateCustomerDeviceDto>(service)
{
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpGet("{customerId}/customers")]
    public async Task<IActionResult> GetByCustomerId(int customerId) => Ok(await service.GetByCustomerIdAsync(customerId));
    [HttpGet("{deviceModelId}/models")]
    public async Task<IActionResult> GetByDeviceModelId(int deviceModelId) => Ok(await service.GetByDeviceModelIdAsync(deviceModelId));
    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetWithDetails(int id) => Ok(await service.GetWithDetailsAsync(id));

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateCustomerDeviceDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateCustomerDeviceDto dto)
        => Ok(await service.UpdateAsync(dto));
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
