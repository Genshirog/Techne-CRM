using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Services.ServiceCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services")]
public class ServiceController(IServiceService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("category/{id}")]
    public async Task<IActionResult> GetAllByCategory(int id) => Ok(await service.GetAllCategoryIdAsync(id));

    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetAllWithDetail(int id) => Ok(await service.GetByIdWithDetailsAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAllWithDetail), new {id = result.Id}, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateServiceDto dto) => Ok(await service.UpdateAsync(id, dto));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
