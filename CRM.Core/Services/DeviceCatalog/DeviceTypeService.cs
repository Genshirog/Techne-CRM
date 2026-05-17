using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.DeviceCatalog;

public class DeviceTypeService : GeneralService<DeviceType, DeviceTypeResponseDto, CreateDeviceTypeDto, UpdateDeviceTypeDto>, IDeviceTypeService
{
    private readonly IDeviceTypeRepository _repo;

    public DeviceTypeService(IDeviceTypeRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<DeviceTypeResponseDto?> GetByNameAsync(string name)
    {
        var entity = await _repo.GetByNameAsync(name) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<IEnumerable<DeviceTypeResponseDto>> GetWithModelAsync()
    {
        var entities = await _repo.GetWithModelAsync() ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public override DeviceType MapToEntity(CreateDeviceTypeDto request) => new()
    {
        Name = request.Name,   
    };

    public override DeviceTypeResponseDto MapToResponse(DeviceType entity) => new()
    {
       Id = entity.Id,
       Name = entity.Name,
       CreatedAt = entity.CreatedAt 
    };

    public override async Task<DeviceTypeResponseDto> UpdateAsync(UpdateDeviceTypeDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.Name = request.Name;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
