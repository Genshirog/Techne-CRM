using CRM.Core.DTOs.Users;
using CRM.Core.Services;

namespace CRM.Core.Services.UserCatalog;

public interface ICompanyService : IGeneralService<CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto>
{
    
}
