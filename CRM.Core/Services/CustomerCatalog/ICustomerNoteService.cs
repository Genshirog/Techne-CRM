using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerCatalog;

public interface ICustomerNoteService : IGeneralService<CustomerNoteResponseDto, CreateCustomerNoteDto, UpdateCustomerNoteDto>
{

}
