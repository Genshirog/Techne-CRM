using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class CustomerAddressService : GeneralService<CustomerAddress, CustomerAddressResponseDto, CreateCustomerAddressDto, UpdateCustomerAddressDto>, ICustomerAddressService
{
    private readonly ICustomerAddressRepository _repo;

    public CustomerAddressService(ICustomerAddressRepository repository) : base(repository)
    {
        _repo = repository;
    }

    public override CustomerAddress MapToEntity(CreateCustomerAddressDto request) => new()
    {
        CustomerId = request.CustomerId,
        Label      = request.Label,
        IsDefault  = request.IsDefault,
        Address    = new Address
        {
            Street     = request.Street,
            Street2    = request.Street2,
            City       = request.City,
            State      = request.State,
            PostalCode = request.PostalCode,
            Country    = request.Country
        }.Normalize()
    };

    public override CustomerAddressResponseDto MapToResponse(CustomerAddress entity) => new()
    {
        Id          = entity.Id,
        CustomerId  = entity.CustomerId,
        Label       = entity.Label,
        IsDefault   = entity.IsDefault,
        Street      = entity.Address.Street,
        Street2     = entity.Address.Street2,
        City        = entity.Address.City,
        State       = entity.Address.State,
        PostalCode  = entity.Address.PostalCode,
        Country     = entity.Address.Country,
        FullAddress = entity.Address.FullAddress
    };

    public override async Task<CustomerAddressResponseDto> UpdateAsync(UpdateCustomerAddressDto request)
    {
        var customer = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Address {request.Id} not found.");

        customer.CustomerId = request.CustomerId;
        customer.Label      = request.Label;
        customer.IsDefault  = request.IsDefault;
        customer.Address    = new Address
        {
            Street     = request.Street,
            Street2    = request.Street2,
            City       = request.City,
            State      = request.State,
            PostalCode = request.PostalCode,
            Country    = request.Country
        }.Normalize();

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