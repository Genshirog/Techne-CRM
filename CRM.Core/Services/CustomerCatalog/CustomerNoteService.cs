using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerNoteService: GeneralService<CustomerNote, CustomerNoteResponseDto, CreateCustomerNoteDto, UpdateCustomerNoteDto>
{
    public CustomerNoteService(ICustomerNoteRepository repository) : base(repository) {}

    public override CustomerNote MapToEntity(CreateCustomerNoteDto request) => new()
    {
        CustomerId = request.CustomerId,
        Note = request.Note
    };

    public override CustomerNoteResponseDto MapToResponse(CustomerNote entity) => new()
    {
        Id = entity.Id,
        CustomerId = entity.CustomerId,
        CreatedBy = entity.CreatedBy,
        Note = entity.Note,
        CreatedAt = entity.CreatedAt
    };

    public override async Task<CustomerNoteResponseDto> UpdateAsync(UpdateCustomerNoteDto request)
    {
        var customer = await _repository.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");

        customer.CustomerId = request.CustomerId;
        customer.Note = request.Note;

        _repository.Update(customer);
        await _repository.SaveChangesAsync();
        return MapToResponse(customer);
    }
}
