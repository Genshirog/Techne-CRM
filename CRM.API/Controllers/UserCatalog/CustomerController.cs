using CRM.Core.DTOs.Users;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/customer")]
public class CustomerController(ICustomerService service) : BaseController<CustomerResponseDto, CreateCustomerDto, UpdateCustomerDto>(service)
{
    [HttpGet("{userId}/user")]
    public async Task<IActionResult> GetByUserId(int userId) => Ok(await service.GetByUserIdAsync(userId));
}
