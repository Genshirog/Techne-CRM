using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Services.DeviceCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.DeviceCatalog;

[ApiController]
[Route("api/device-types")]
public class DeviceTypeController(IDeviceTypeService service) : BaseController<DeviceTypeResponseDto, CreateDeviceTypeDto, UpdateDeviceTypeDto>(service)
{
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetByName(string name) => Ok(await service.GetByNameAsync(name));

    [HttpGet("model")]
    public async Task<IActionResult> GetWithModel() => Ok(await service.GetWithModelAsync());

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateDeviceTypeDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateDeviceTypeDto dto)
        => Ok(await service.UpdateAsync(dto));
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
