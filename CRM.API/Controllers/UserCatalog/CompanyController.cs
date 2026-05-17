using CRM.Core.DTOs.Users;
using CRM.Core.Services.UserCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.UserCatalog;

[ApiController]
[Route("api/company")]
public class CompanyController(ICompanyService service) : BaseController<CompanyResponseDto, CreateCompanyDto,UpdateCompanyDto>(service)
{

}
