using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Services.InquiryCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.InquiryCatalog;

[ApiController]
[Route("api/diagnosis")]
public class DiagnosisController(IDiagnosisCatalogService service) : BaseController<DiagnosisCatalogResponseDto, CreateDiagnosisCatalogeDto, UpdateDiagnosisCatalogDto>(service)
{
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetByName(string name) => Ok(await service.GetByNameAsync(name));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateDiagnosisCatalogeDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateDiagnosisCatalogDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
