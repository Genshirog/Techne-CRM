using CRM.Core.DTOs.Users;
namespace CRM.Core.Services.UserCatalog;

public interface IUserService : IGeneralService<UserResponseDto, CreateUserDto, UpdateUserDto>
{
    Task<AuthResponseDto> RegisterAsync(CreateUserDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task UpdateRoleAsync(UpdateUserRoleDto request);
    Task ChangePasswordAsync(ChangePasswordDto request);
}
