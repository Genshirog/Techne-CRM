using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceCatalog;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceCategoryService : IServiceCategoryService
{
    private readonly IServiceCategoryRepository _repo;

    private ServiceCategoryResponseDto MapToResponse(ServiceCategory entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Type = entity.Type.ToString(),
        CreatedAt = entity.CreatedAt
    };

    public ServiceCategoryService(IServiceCategoryRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<ServiceCategoryResponseDto>> GetAllAsync() => (await _repo.GetAllAsync()).Select(MapToResponse);

    public async Task<ServiceCategoryResponseDto?> GetByIdAsync(int id)
    {
        var category = await _repo.GetByIdAsync(id);
        return category == null ? null : MapToResponse(category);
    }

    public async Task<ServiceCategoryResponseDto> CreateAsync(CreateServiceCategoryDto dto)
    {
        if (await _repo.ExistByNameAsync(dto.Name))
        {
            throw new Exception("Category already exists");
        }

        var entity = new ServiceCategory
        {
            Name = dto.Name,
            Type = Enum.Parse<ServiceCategoryType>(dto.Type)
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task<ServiceCategoryResponseDto> UpdateAsync(int id, UpdateServiceCategoryDto dto)
    {
        var entity = await _repo.GetByIdAsync(id) ?? throw new Exception("Category Not Found");

        entity.Name = dto.Name;
        entity.Type = Enum.Parse<ServiceCategoryType>(dto.Type);
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id) ?? throw new Exception("Category Not Found");
        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }
}
