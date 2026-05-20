using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerTagService: GeneralService<CustomerTag, CustomerTagResponseDto, CreateCustomerTagDto,UpdateCustomerTagDto>, ICustomerTagService
{
    private readonly ICustomerTagRepository _repo;
    public CustomerTagService(ICustomerTagRepository repository) : base(repository)
    {
        _repo = repository;
    }

    public async Task<CustomerTagResponseDto> AssignAsync(int customerId, int tagId)
    {
        var entity = new CustomerTag
        {
            CustomerId = customerId,
            TagId      = tagId,
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return MapToResponse(entity);
    }

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

    public async Task RemoveAsync(int customerId, int customerTagId)
    {
        var entity = await _repo.GetByIdAsync(customerTagId)
            ?? throw new KeyNotFoundException($"Tag assignment {customerTagId} not found.");

        if (entity.CustomerId != customerId)
            throw new UnauthorizedAccessException("Tag assignment does not belong to this customer.");

        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }


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
