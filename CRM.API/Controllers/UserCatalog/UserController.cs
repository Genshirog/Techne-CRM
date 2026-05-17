using CRM.Core.DTOs.Users;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService service) : BaseController<UserResponseDto, CreateUserDto, UpdateUserDto>(service)
{
    public async Task<IActionResult> UpdateRole(UpdateUserRoleDto request)
    {
      await service.UpdateRoleAsync(request);
      return NoContent();  
    } 

    public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
    {
        await service.ChangePasswordAsync(request);
        return NoContent();
    }
}
