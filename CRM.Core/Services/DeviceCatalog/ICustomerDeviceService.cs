using CRM.Core.DTOs.DeviceCatalog;

namespace CRM.Core.Services.DeviceCatalog;

public interface ICustomerDeviceService : IGeneralService<CustomerDeviceResponseDto, CreateCustomerDeviceDto, UpdateCustomerDeviceDto>
{
    Task<IEnumerable<CustomerDeviceResponseDto>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<CustomerDeviceResponseDto>> GetByDeviceModelIdAsync(int deviceModelId);
    Task<CustomerDeviceResponseDto?> GetWithDetailsAsync(int id);
}
