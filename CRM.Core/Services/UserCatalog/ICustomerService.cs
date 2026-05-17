using CRM.Core.DTOs.Users;

namespace CRM.Core.Services.UserCatalog;

public interface ICustomerService : IGeneralService<CustomerResponseDto, CreateCustomerDto, UpdateCustomerDto>
{
    Task<CustomerResponseDto> GetByUserIdAsync(int userId);
}
