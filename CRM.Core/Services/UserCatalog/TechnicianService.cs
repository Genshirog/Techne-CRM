using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using CRM.Core.Services;

namespace CRM.Core.Services.UserCatalog;

public class TechnicianService : GeneralService<Technician, TechnicianResponseDto, CreateTechnicianDto, UpdateTechnicianDto>, ITechnicianService
{
    private readonly ITechnicianRepository _technicianRepository;
    
    public TechnicianService(ITechnicianRepository repository) : base(repository)
    {
        _technicianRepository = repository;
    }

    public override async Task<TechnicianResponseDto> UpdateAsync(UpdateTechnicianDto request)
    {
        var technician = await _technicianRepository.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");

        technician.UserId = request.UserId;
        technician.Specialization = request.Specialization;

        _technicianRepository.Update(technician);
        await _technicianRepository.SaveChangesAsync();
        return MapToResponse(technician);
    }

    public async Task<IEnumerable<TechnicianResponseDto>> GetAllAvailableAsync()
    {
        var technician = await _technicianRepository.GetAllAvailableAsync();
        return technician.Select(MapToResponse);
    }

    public async Task<TechnicianResponseDto> GetByUserIdAsync(int userId)
    {
        var technician = await _technicianRepository.GetByUserIdAsync(userId)?? throw new Exception($"Technician with userId {userId} not found.");
        return MapToResponse(technician);

    }

    public async Task<TechnicianResponseDto> UpdateAvailabilityAsync(UpdateTechnicianAvailabilityDto request)
    {
        var technician = await _technicianRepository.GetByUserIdAsync(request.Id)?? throw new Exception($"Technician with userId {request.Id} not found.");
        technician.IsAvailable = request.IsAvailable;
        technician.UpdatedAt = DateTime.UtcNow;
        _technicianRepository.Update(technician);
        await _technicianRepository.SaveChangesAsync();
        return MapToResponse(technician);
    }

    public override TechnicianResponseDto MapToResponse(Technician entity) => new()
    {
        Id = entity.Id,
        UserId = entity.UserId,
        Specialization = entity.Specialization,
        AverageRating = entity.AverageRating,
        IsAvailable = entity.IsAvailable,
        TotalReviews = entity.TotalReviews,
        CreatedAt = entity.CreatedAt,
        User = entity.User is null ? null : new UserResponseDto
        {
            Id = entity.User.Id,
            Name = entity.User.Name,
            Email = entity.User.Email,
            PhoneNumber = entity.User.PhoneNumber,
        }
    };

    public override Technician MapToEntity(CreateTechnicianDto request) => new()
    {
        UserId = request.UserId,
        Specialization = request.Specialization
    };
}
