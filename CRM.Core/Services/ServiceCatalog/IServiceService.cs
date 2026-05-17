using System.ComponentModel;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.ServiceCatalog;

public interface IServiceService
{
    Task<IEnumerable<ServiceResponseDto>> GetAllAsync();
    Task<IEnumerable<ServiceResponseDto>> GetAllCategoryIdAsync(int categoryId);
    Task<ServiceDetailResponseDto?> GetByIdWithDetailsAsync(int id);
    Task<ServiceResponseDto> CreateAsync(CreateServiceDto dto);
    Task<ServiceResponseDto> UpdateAsync(int id, UpdateServiceDto dto);
    Task DeleteAsync(int id);
}
