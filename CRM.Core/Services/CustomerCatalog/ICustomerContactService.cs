using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;

namespace CRM.Core;

public interface ICustomerContactService : IGeneralService<CustomerContactResponseDto, CreateCustomerContactDto, UpdateCustomerContactDto>
{

}
