using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.DTOs.Users;
using CRM.Core.Services.CustomerCatalog;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/customer")]
public class CustomerController(ICustomerService service, ICustomerTagService customerTagService, ICustomerNoteService noteService) : BaseController<CustomerResponseDto, CreateCustomerDto, UpdateCustomerDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpGet("{userId}/user")]
    public async Task<IActionResult> GetByUserId(int userId) => Ok(await service.GetByUserIdAsync(userId));

    [HttpPost("{customerId:int}/note")]
    public async Task<IActionResult> AddNote(int customerId, [FromBody] CreateCustomerNoteDto dto)
        => Ok(await noteService.AddAsync(customerId, dto));

    [HttpPut("{customerId:int}/note/{noteId:int}")]
    public async Task<IActionResult> UpdateNote(int customerId, int noteId, [FromBody] UpdateCustomerNoteDto dto)
        => Ok(await noteService.UpdateAsync(customerId, noteId, dto));

    [HttpDelete("{customerId:int}/note/{noteId:int}")]
    public async Task<IActionResult> DeleteNote(int customerId, int noteId)
    {
        await noteService.DeleteAsync(customerId, noteId);
        return NoContent();
    }

    [HttpPost("{customerId:int}/tag")]
    public async Task<IActionResult> AssignTag(int customerId, [FromBody] AssignCustomerTagDto dto)
        => Ok(await customerTagService.AssignAsync(customerId, dto.TagId));

    [HttpDelete("{customerId:int}/tag/{customerTagId:int}")]
    public async Task<IActionResult> RemoveTag(int customerId, int customerTagId)
    {
        await customerTagService.RemoveAsync(customerId, customerTagId);
        return NoContent();
    }
}
