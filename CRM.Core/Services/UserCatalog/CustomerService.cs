using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using CRM.Core.Services;

namespace CRM.Core.Services.UserCatalog;

public class CustomerService : GeneralService<Customer, CustomerResponseDto, CreateCustomerDto, UpdateCustomerDto>, ICustomerService
{
    private readonly ICustomerRepository _repo;
    public CustomerService(ICustomerRepository repository) : base(repository)
    {
        _repo = repository;
    }

    public override async Task<CustomerResponseDto> UpdateAsync(UpdateCustomerDto request)
    {
        var customer = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Company {request.Id} not found.");
        customer.CompanyId = request.CompanyId;
        customer.UserId = request.UserId;

        _repo.Update(customer);
        await _repo.SaveChangesAsync();
        return MapToResponse(customer);
    }

    public override CustomerResponseDto MapToResponse(Customer entity) => new()
    {
        Id = entity.Id,
        CompanyId = entity.CompanyId,
        UserId = entity.UserId,
        Name        = entity.User?.Name ?? string.Empty,
        Email       = entity.User?.Email ?? string.Empty,
        PhoneNumber = entity.User?.PhoneNumber ?? string.Empty,


        CustomerAddress = entity.CustomerAddresses?.Select(a => new CustomerAddressResponseDto
        {
            Id          = a.Id,
            CustomerId  = a.CustomerId,
            Label       = a.Label,
            IsDefault   = a.IsDefault,
            Street      = a.Address.Street,
            Street2     = a.Address.Street2,
            City        = a.Address.City,
            State       = a.Address.State,
            PostalCode  = a.Address.PostalCode,
            Country     = a.Address.Country,
            FullAddress = a.Address.FullAddress,
        }).ToList() ?? [],
        CustomerContact = entity.CustomerContacts?.Select(c => new CustomerContactResponseDto
        {
            Id = c.Id,
            Value = c.Value,
            Type = c.Type,
        }).ToList() ?? [],
        CustomerNote = entity.CustomerNotes?.Select(n => new CustomerNoteResponseDto
        {
           Id = n.Id,
           CreatedBy = n.CreatedBy,
           Note = n.Note,
        }).ToList() ?? [],
        CustomerTag = entity.CustomerTags?.Select(t => new CustomerTagResponseDto
        {
            TagId = t.TagId,
            TagName = t.Tag.Name,
            TagColor = t.Tag.Color
        }).ToList() ?? []
    };

    public override Customer MapToEntity(CreateCustomerDto request) => new()
    {
        CompanyId = request.CompanyId,
        UserId = request.UserId,
    };

    public async Task<CustomerResponseDto> GetByUserIdAsync(int userId)
    {
        var entity = await _repo.GetByUserIdAsync(userId) ?? throw new Exception("Not Found");
        return MapToResponse(entity);
    }
}
