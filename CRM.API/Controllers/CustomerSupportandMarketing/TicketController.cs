using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;

[ApiController]
[Route("api/tickets")]
public class TicketController(ITicketService service) : BaseController<TicketResponseDto, CreateTicketDto, UpdateTicketDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet]
    public override async Task<IActionResult> GetAll()
        => Ok(await service.GetAllAsync());

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }
    [Authorize(Roles = "Admin,SuperAdmin,Technician,Customer")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateTicketDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateTicketDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
