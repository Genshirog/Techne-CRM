using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerContactService : GeneralService<CustomerContact, CustomerContactResponseDto, CreateCustomerContactDto, UpdateCustomerContactDto>
{
    public CustomerContactService(ICustomerContactRepository repository) : base(repository) {}

    public override CustomerContact MapToEntity(CreateCustomerContactDto request) => new()
    {
        CustomerId = request.CustomerId,
        Type = request.Type,
        Value = request.Value
    };

    public override CustomerContactResponseDto MapToResponse(CustomerContact entity) => new()
    {
        Id = entity.Id,
        CustomerId = entity.CustomerId,
        Type = entity.Type,
        Value = entity.Value,
        CreatedAt = entity.CreatedAt
    };

    public override async Task<CustomerContactResponseDto> UpdateAsync(UpdateCustomerContactDto request)
    {
        var customer = await _repository.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");

        customer.CustomerId = request.CustomerId;
        customer.Type = request.Type;
        customer.Value = request.Value;

        _repository.Update(customer);
        await _repository.SaveChangesAsync();
        return MapToResponse(customer);  
    }
}
