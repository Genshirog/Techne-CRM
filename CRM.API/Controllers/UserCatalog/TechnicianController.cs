using CRM.Core.DTOs.Users;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/technician")]
public class TechnicianController(ITechnicianService service) : BaseController<TechnicianResponseDto, CreateTechnicianDto, UpdateTechnicianDto>(service)
{
    [HttpGet("{userId}/user")]
    public async Task<IActionResult> GetByUserId(int userId) => Ok(await service.GetByUserIdAsync(userId));
    [HttpGet("is-available")]
    public async Task<IActionResult> GetAllAvailable() => Ok(await service.GetAllAvailableAsync());
    [HttpPatch("{request}/availability")]
    public async Task<IActionResult> UpdateAvailability(UpdateTechnicianAvailabilityDto request) => Ok(await service.UpdateAvailabilityAsync(request));
}
