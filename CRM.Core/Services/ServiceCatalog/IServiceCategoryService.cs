using CRM.Core.DTOs.ServiceCatalog;

namespace CRM.Core.Services.ServiceCatalog;

public interface IServiceCategoryService
{
    Task<IEnumerable<ServiceCategoryResponseDto>> GetAllAsync();
    Task<ServiceCategoryResponseDto?> GetByIdAsync(int id);
    Task<ServiceCategoryResponseDto> CreateAsync(CreateServiceCategoryDto dto);
    Task<ServiceCategoryResponseDto> UpdateAsync(int id, UpdateServiceCategoryDto dto);
    Task DeleteAsync(int id);
}
