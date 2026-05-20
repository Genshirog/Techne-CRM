using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerCatalog;

public interface ICustomerNoteService : IGeneralService<CustomerNoteResponseDto, CreateCustomerNoteDto, UpdateCustomerNoteDto>
{
    Task<CustomerNoteResponseDto>  AddAsync(int customerId, CreateCustomerNoteDto dto);
    Task<CustomerNoteResponseDto>  UpdateAsync(int customerId, int noteId, UpdateCustomerNoteDto dto);
    Task                           DeleteAsync(int customerId, int noteId);
}
