using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerTagService: GeneralService<CustomerTag, CustomerTagResponseDto, CreateCustomerTagDto,UpdateCustomerTagDto>
{
    public CustomerTagService(ICustomerTagRepository repository) : base(repository){}

    public override CustomerTag MapToEntity(CreateCustomerTagDto request) => new()
    {
        CustomerId = request.CustomerId,
        TagId = request.TagId
    };

    public override CustomerTagResponseDto MapToResponse(CustomerTag entity) => new()
    {
        CustomerId = entity.CustomerId,
        TagId = entity.TagId
    };

    public override async Task<CustomerTagResponseDto> UpdateAsync(UpdateCustomerTagDto request)
    {
        var customer = await _repository.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");

        customer.CustomerId = request.CustomerId;
        customer.TagId = request.TagId;

        _repository.Update(customer);
        await _repository.SaveChangesAsync();
        return MapToResponse(customer);
    }
}
