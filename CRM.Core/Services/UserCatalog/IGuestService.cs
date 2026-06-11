using CRM.Core.DTOs.Users;

namespace CRM.Core.Services.UserCatalog;

public interface IGuestService : IGeneralService<GuestResponseDto, CreateGuestDto, UpdateGuestDto>
{
    Task<GuestResponseDto> GetByEmailAsync(string email);
    Task<GuestResponseDto> GetByPhoneNumberAsync(string phoneNumber);
}
