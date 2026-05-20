using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using CRM.Core.Services.UserCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerNoteService: GeneralService<CustomerNote, CustomerNoteResponseDto, CreateCustomerNoteDto, UpdateCustomerNoteDto>, ICustomerNoteService
{
    private readonly ICustomerNoteRepository _repo;
    public CustomerNoteService(ICustomerNoteRepository repository) : base(repository)
    {
        _repo = repository;
    }

    public async Task<CustomerNoteResponseDto> AddAsync(int customerId, CreateCustomerNoteDto dto)
    {
        var entity = new CustomerNote
        {
            CustomerId = customerId,
            Note       = dto.Note,
            CreatedBy = dto.CreatedBy,
            CreatedAt  = DateTime.UtcNow,
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return MapToResponse(entity);
    }

    public async Task DeleteAsync(int customerId, int noteId)
    {
        var entity = await _repo.GetByIdAsync(noteId)
            ?? throw new KeyNotFoundException($"Note {noteId} not found.");

        if (entity.CustomerId != customerId)
            throw new UnauthorizedAccessException("Note does not belong to this customer.");

        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }

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

    public async Task<CustomerNoteResponseDto> UpdateAsync(int customerId, int noteId, UpdateCustomerNoteDto dto)
    {
        var entity = await _repo.GetByIdAsync(noteId) 
            ?? throw new KeyNotFoundException($"Note {noteId} not found.");

        if (entity.CustomerId != customerId)
            throw new UnauthorizedAccessException("Note does not belong to this customer.");

        entity.Note      = dto.Note;
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();

        return MapToResponse(entity);
    }

}
