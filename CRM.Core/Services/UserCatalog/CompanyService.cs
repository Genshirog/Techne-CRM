using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using CRM.Core.Services;

namespace CRM.Core.Services.UserCatalog;

public class CompanyService : GeneralService<Company, CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto>
{
    public CompanyService(ICompanyRepository repository) : base(repository){}

    public override async Task<CompanyResponseDto> UpdateAsync(UpdateCompanyDto request)
    {
        var company = await _repository.GetByIdAsync(request.Id)
            ?? throw new Exception($"Company {request.Id} not found.");

        company.Name = request.Name;
        company.Email = request.Email;
        company.PhoneNumber = request.PhoneNumber;
        company.Address = request.Address;

        _repository.Update(company);
        await _repository.SaveChangesAsync();
        return MapToResponse(company);
    }

    public override CompanyResponseDto MapToResponse(Company entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Email = entity.Email,
        PhoneNumber = entity.PhoneNumber,
        Address = entity.Address,
        CreatedAt = entity.CreatedAt  
    };


    public override Company MapToEntity(CreateCompanyDto request) => new()
    {
        Name = request.Name,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        Address = request.Address
    };
}
