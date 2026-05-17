using CRM.Core.DTOs.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public interface ICustomerTagService : IGeneralService<CustomerTagResponseDto, CreateCustomerTagDto, UpdateCustomerTagDto>
{

}
