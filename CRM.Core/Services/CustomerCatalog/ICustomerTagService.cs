using CRM.Core.DTOs.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public interface ICustomerTagService : IGeneralService<CustomerTagResponseDto, CreateCustomerTagDto, UpdateCustomerTagDto>
{
    Task<CustomerTagResponseDto>  AssignAsync(int customerId, int tagId);
    Task                          RemoveAsync(int customerId, int customerTagId);
}
