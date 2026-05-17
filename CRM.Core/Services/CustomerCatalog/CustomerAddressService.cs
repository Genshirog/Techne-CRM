using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerAddressService: GeneralService<CustomerAddress, CustomerAddressResponseDto,CreateCustomerAddressDto,UpdateCustomerAddressDto>, ICustomerAddressService
{
    private readonly ICustomerAddressRepository _repo;

    public CustomerAddressService(ICustomerAddressRepository repository) : base(repository){
        _repo = repository;
    }

    public override CustomerAddress MapToEntity(CreateCustomerAddressDto request) => new()
    {
        CustomerId = request.CustomerId,
        Address = request.Address,
        IsDefault = request.IsDefault,
        Label = request.Label
    };

    public override CustomerAddressResponseDto MapToResponse(CustomerAddress entity) => new()
    {
        Id = entity.Id,
        CustomerId = entity.CustomerId,
        Address = entity.Address,
        IsDefault = entity.IsDefault,
        Label = entity.Label
    };

    public override async Task<CustomerAddressResponseDto> UpdateAsync(UpdateCustomerAddressDto request)
    {
        var customer = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");

        customer.CustomerId = request.CustomerId;
        customer.Address = request.Address;
        customer.IsDefault = request.IsDefault;
        customer.Label = request.Label;

        _repo.Update(customer);
        await _repo.SaveChangesAsync();
        return MapToResponse(customer);
    }

    public async Task<IEnumerable<CustomerAddressResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var addresses = await _repo.GetByCustomerIdAsync(customerId);
        return addresses.Select(MapToResponse);
    }
}
