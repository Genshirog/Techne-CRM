using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceCatalog;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _repo;

    private static ServiceResponseDto MapToResponse(Service entity) => new()
    {
        Id = entity.Id,
        ServiceCategoryId = entity.ServiceCategoryId,
        CategoryName = entity.ServiceCategory?.Name ?? string.Empty,
        Name = entity.Name,
        Description = entity.Description,
        CreatedAt = entity.CreatedAt
    };

    private static ServiceDetailResponseDto MapToDetailResponse(Service entity) => new()
    {
        Id = entity.Id,
        ServiceCategoryId = entity.ServiceCategoryId,
        CategoryName = entity.ServiceCategory?.Name ?? string.Empty,
        Name = entity.Name,
        Description = entity.Description,
        CreatedAt = entity.CreatedAt,
        Scopes = entity.Scopes.Select(s => new ServiceScopeResponseDto{
            Id = s.Id,
            ServiceId = s.ServiceId,
            Title = s.Title,
            Order = s.Order,
            Cases = s.ServiceScopeCases.Select(c => new ServiceScopeCaseResponseDto
            {
                Id = c.Id,
                ServiceScopeId = c. ServiceScopeId,
                Title = c.Title,
                Order = c.Order,
                Items = c.ServiceScopeCaseItems.Select(i => new ServiceScopeCaseItemResponseDto
                {
                    Id = i.Id,
                    ServiceScopeCaseId = i.ServiceScopeCaseId,
                    Content = i.Content,
                    Order = i.Order
                }).ToList()
            }).ToList()
        }).ToList(),
        Waivers = entity.Waivers.Select(w => new ServiceWaiverResponseDto
        {
            Id = w.Id,
            ServiceId = w.ServiceId,
            Title = w.Title,
            Order = w.Order,
            Cases = w.Cases.Select(c => new ServiceWaiverCaseResponseDto
            {
                Id = c.Id,
                ServiceWaiverId = c.ServiceWaiverId,
                Title = c.Title,
                Order = c.Order,
                Items = c.ServiceWaiverCaseItems.Select(i => new ServiceWaiverCaseItemResponseDto
                {
                    Id = i.Id,
                    ServiceWaiverCaseId = i.ServiceWaiverCaseId,
                    Content = i.Content,
                    Order = i.Order
                }).ToList()
            }).ToList()
        }).ToList(),
        Terms = entity.Terms.Select(t => new ServiceTermResponseDto
        {
            Id = t.Id,
            ServiceId = t.ServiceId,
            Title = t.Title,
            Order = t.Order,
            Items = t.Items.Select(i => new ServiceTermItemResponseDto
            {
                Id = i.Id,
                ServiceTermId = i.ServiceTermId,
                Content = i.Content,
                Order = i.Order
            }).ToList()
        }).ToList(),
        Deliverables = entity.Deliverables.Select(d => new ServiceDeliverableResponseDto
        {
            Id = d.Id,
            ServiceId = d.ServiceId,
            Content = d.Content,
            Order = d.Order
        }).ToList()
    };
    public ServiceService(IServiceRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<ServiceResponseDto>> GetAllAsync()
    {
        var services = await _repo.GetAllWithCategoryAsync();
        return services.Select(MapToResponse);
    }

    public async Task<IEnumerable<ServiceResponseDto>> GetAllCategoryIdAsync(int categoryId)
    {
        var services = await _repo.GetAllByCategoryIdAsync(categoryId);
        return services.Select(MapToResponse);
    }

    public async Task<ServiceDetailResponseDto?> GetByIdWithDetailsAsync(int id)
    {
        var services = await _repo.GetByIdWithDetailsAsync(id);
        if(services == null) return null;
        return MapToDetailResponse(services);
    }

    public async Task<ServiceResponseDto> CreateAsync(CreateServiceDto dto)
    {
        var entity = new Service
        {
            ServiceCategoryId = dto.ServiceCategoryId,
            Name = dto.Name,
            Description = dto.Description
        };
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task<ServiceResponseDto> UpdateAsync(int id, UpdateServiceDto dto)
    {
        var entity = await _repo.GetByIdAsync(id) ?? throw new Exception ("Service Not Found");
        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.ServiceCategoryId = dto.ServiceCategoryId;
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id) ?? throw new Exception ("Service Not Found");
        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }
}
