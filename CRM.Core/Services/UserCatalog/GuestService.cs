using CRM.Core.DTOs.Users;
using CRM.Core.Repositories.UserCatalog;

namespace CRM.Core.Services.UserCatalog;

public class GuestService : GeneralService<Guest,GuestResponseDto,CreateGuestDto,UpdateGuestDto>, IGuestService
{
    private readonly IGuestRepository _repo;

    public GuestService(IGuestRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<GuestResponseDto> GetByEmailAsync(string email)
    {
        var entity = await _repo.GetByEmailAsync(email) ?? throw new Exception("Not Found");
        return MapToResponse(entity);
    }

    public async Task<GuestResponseDto> GetByPhoneNumberAsync(string phoneNumber)
    {
        var entity = await _repo.GetByPhoneAsync(phoneNumber) ?? throw new Exception("Not Found");
        return MapToResponse(entity);
    }

    public override Guest MapToEntity(CreateGuestDto request) => new()
    {
        Email = request.Email,
        Name = request.Name,
        PhoneNumber = request.PhoneNumber
    };

    public override GuestResponseDto MapToResponse(Guest entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Email = entity.Email,
        PhoneNumber = entity.PhoneNumber,
        CreatedAt = entity.CreatedAt,
    };

    public override Task<GuestResponseDto> UpdateAsync(UpdateGuestDto request)
    {
        throw new NotImplementedException();
    }
}
