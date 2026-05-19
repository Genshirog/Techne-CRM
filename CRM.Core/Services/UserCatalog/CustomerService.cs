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
