using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
public abstract class BaseChildController<TEntity, TResponse, TCreate>(IChildService<TEntity, TResponse, TCreate> service) : ControllerBase where TEntity:class where TResponse:class where TCreate:class
{
    [HttpGet("parent/{parentId}")]
    public virtual async Task<IActionResult> GetByParentId(int parentId) => Ok(await service.GetByParentIdAsync(parentId));

    [HttpGet("{id}")]
    public virtual async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }
    [HttpPost]
    public virtual async Task<IActionResult> Create(TCreate dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = (result as dynamic).Id}, result);
        
    }

    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
