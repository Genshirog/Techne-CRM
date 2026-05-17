using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public class CustomerDeviceService : GeneralService<CustomerDevice, CustomerDeviceResponseDto, CreateCustomerDeviceDto, UpdateCustomerDeviceDto>, ICustomerDeviceService
{
    private readonly ICustomerDeviceRepository _repo;

    public CustomerDeviceService(ICustomerDeviceRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<CustomerDeviceResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerIdAsync(customerId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<CustomerDeviceResponseDto>> GetByDeviceModelIdAsync(int deviceModelId)
    {
        var entities = await _repo.GetByDeviceModelAsync(deviceModelId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<CustomerDeviceResponseDto?> GetWithDetailsAsync(int id)
    {
        var entity = await _repo.GetWithDetailsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override CustomerDevice MapToEntity(CreateCustomerDeviceDto request) => new()
    {
        CustomerId = request.CustomerId,
        DeviceModelId = request.DeviceModelId,
        PurchaseTime = request.PurchaseTime,
        SerialNumber = request.SerialNumber,
    };

    public override CustomerDeviceResponseDto MapToResponse(CustomerDevice entity) => new()
    {
        Id = entity.Id,
        CustomerId = entity.CustomerId,
        DeviceModelId = entity.DeviceModelId,
        PurchaseTime = entity.PurchaseTime,
        SerialNumber = entity.SerialNumber,
        CreatedAt = entity.CreatedAt,
    };

    public override async Task<CustomerDeviceResponseDto> UpdateAsync(UpdateCustomerDeviceDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.CustomerId = request.CustomerId;
        entity.DeviceModelId = request.DeviceModelId;
        entity.PurchaseTime = request.PurchaseTime;
        entity.SerialNumber = request.SerialNumber;
        
        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
