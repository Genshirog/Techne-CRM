using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.DTOs.Users;

namespace CRM.Core.Services.CustomerCatalog;

public interface ICustomerAddressService: IGeneralService<CustomerAddressResponseDto, CreateCustomerAddressDto, UpdateCustomerAddressDto>
{
    Task<IEnumerable<CustomerAddressResponseDto>> GetByCustomerIdAsync(int customerId);
}
