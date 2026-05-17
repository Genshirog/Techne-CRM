using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Services.DeviceCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.DeviceCatalog;

[Authorize]
[ApiController]
[Route("api/device-models")]
public class DeviceModelController(IDeviceModelService service) : BaseController<DeviceModelResponseDto, CreateDeviceModelDto, UpdateDeviceModelDto>(service)
{
    [HttpGet("{brandId}/brand")]
    public async Task<IActionResult> GetByBrandId(int brandId) => Ok(await service.GetByBrandIdAsync(brandId));
    [HttpGet("{deviceTypeId}/type")]
    public async Task<IActionResult> GetByDeviceTypeId(int deviceTypeId) => Ok(await service.GetByDeviceTypeIdAsync(deviceTypeId));
    [HttpGet("{name}")]
    public async Task<IActionResult> GetByName(string name) => Ok(await service.GetByNameAsync(name));

    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateDeviceModelDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateDeviceModelDto dto)
        => Ok(await service.UpdateAsync(dto));
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
