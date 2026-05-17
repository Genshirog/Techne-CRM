using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.DeviceCatalog;

public class DeviceBrandService : GeneralService<DeviceBrand, DeviceBrandResponseDto, CreateDeviceBrandDto, UpdateDeviceBrandDto>, IDeviceBrandService
{
    private readonly IDeviceBrandRepository _repo;

    public DeviceBrandService(IDeviceBrandRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<DeviceBrandResponseDto?> GetByNameAsync(string name)
    {
        var entity = await _repo.GetByNameAsync(name) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<IEnumerable<DeviceBrandResponseDto>> GetWithModelAsync()
    {
        var entities = await _repo.GetWithModelAsync() ?? throw new Exception($"Not found");
        return entities.Select(MapToResponse);
    }

    public override DeviceBrand MapToEntity(CreateDeviceBrandDto request) => new()
    {
        DeviceTypeId = request.DeviceTypeId,
        Name = request.Name
    };

    public override DeviceBrandResponseDto MapToResponse(DeviceBrand entity) => new()
    {
        Id = entity.Id,
        DeviceTypeId = entity.DeviceTypeId,
        Name = entity.Name,
        CreatedAt = entity.CreatedAt,
    };

    public override async Task<DeviceBrandResponseDto> UpdateAsync(UpdateDeviceBrandDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.DeviceTypeId = request.DeviceTypeId;
        entity.Name = request.Name;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
