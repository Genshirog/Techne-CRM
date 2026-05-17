using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers;

[ApiController]
public abstract class BaseController<TResponse, TCreate, TUpdate>(
    IGeneralService<TResponse, TCreate, TUpdate> service) : ControllerBase
    where TResponse : class
    where TCreate : class
    where TUpdate : class
{
    [HttpGet]
    public virtual async Task<IActionResult> GetAll()
        => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    public virtual async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public virtual async Task<IActionResult> Create([FromBody] TCreate dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [HttpPut]
    public virtual async Task<IActionResult> Update([FromBody] TUpdate dto)
        => Ok(await service.UpdateAsync(dto));

    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}