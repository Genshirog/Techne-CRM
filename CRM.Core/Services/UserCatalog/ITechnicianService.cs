using CRM.Core.DTOs.Users;

namespace CRM.Core.Services.UserCatalog;

public interface ITechnicianService : IGeneralService<TechnicianResponseDto, CreateTechnicianDto, UpdateTechnicianDto>
{
    Task<TechnicianResponseDto> GetByUserIdAsync(int userid);
    Task<IEnumerable<TechnicianResponseDto>> GetAllAvailableAsync();
    Task<TechnicianResponseDto> UpdateAvailabilityAsync(UpdateTechnicianAvailabilityDto request);
}
