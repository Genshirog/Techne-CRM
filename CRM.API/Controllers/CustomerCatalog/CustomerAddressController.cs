using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Services.CustomerCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerCatalog;

[ApiController]
[Route("api/customer-addresss")]
public class CustomerAddressController(ICustomerAddressService service) : BaseController<CustomerAddressResponseDto, CreateCustomerAddressDto, UpdateCustomerAddressDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet]
    public override async Task<IActionResult> GetAll()
        => Ok(await service.GetAllAsync());

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(int id)
    {
        var result = await service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]    
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateCustomerAddressDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateCustomerAddressDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin,Customer")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("{customerId}/customer")]
    public async Task<IActionResult> GetByCustomerId(int customerId)
        => Ok(await service.GetByCustomerIdAsync(customerId));
}
