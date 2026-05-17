using CRM.Core.DTOs;
using CRM.Core.DTOs.Users;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService){
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(CreateUserDto request){
        try{
            var response = await _userService.RegisterAsync(request);
            return Ok(response);
        }catch(Exception ex){
            return BadRequest(new {message = ex.Message});
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var response = await _userService.LoginAsync(request);
        return Ok(response);
    }
}
