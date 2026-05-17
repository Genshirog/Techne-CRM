using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public class DeviceModelService : GeneralService<DeviceModel, DeviceModelResponseDto, CreateDeviceModelDto, UpdateDeviceModelDto>, IDeviceModelService
{
    private readonly IDeviceModelRepository _repo;

    public DeviceModelService(IDeviceModelRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<DeviceModelResponseDto>> GetByBrandIdAsync(int brandId)
    {
        var entities = await _repo.GetByBrandIdAsync(brandId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<DeviceModelResponseDto>> GetByDeviceTypeIdAsync(int deviceTypeId)
    {
        var entities = await _repo.GetByDeviceTypeIdAsync(deviceTypeId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<DeviceModelResponseDto?> GetByNameAsync(string name)
    {
        var entity = await _repo.GetByNameAsync(name) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override DeviceModel MapToEntity(CreateDeviceModelDto request) => new()
    {
        DeviceBrandId = request.DeviceBrandId,
        Name = request.Name,    
    };

    public override DeviceModelResponseDto MapToResponse(DeviceModel entity) => new()
    {
        Id = entity.Id,
        DeviceBrandId = entity.DeviceBrandId,
        Name = entity.Name,   
        CreatedAt = entity.CreatedAt,
    };

    public override async Task<DeviceModelResponseDto> UpdateAsync(UpdateDeviceModelDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.DeviceBrandId = request.DeviceBrandId;
        entity.Name = request.Name;
        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
