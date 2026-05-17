using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Services.ServiceCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-categories")]
public class ServiceCategoryController (IServiceCategoryService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) => Ok(await service.GetByIdAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceCategoryDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = result.Id}, result);
    }
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateServiceCategoryDto dto) => Ok(await service.UpdateAsync(id, dto));
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
