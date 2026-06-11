using CRM.API.Controllers;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/guest")]
public class GuestController(IGuestService service) : BaseController<GuestResponseDto, CreateGuestDto, UpdateGuestDto>(service)
{
    [HttpGet ("/email")]
    public async Task<IActionResult> GetByEmail(string email) => Ok(await service.GetByEmailAsync(email));
    [HttpGet ("/phoneNumber")]
    public async Task<IActionResult> GetByPhoneNumber(string phoneNumber) => Ok(await service.GetByPhoneNumberAsync(phoneNumber));
}
