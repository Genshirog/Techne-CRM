using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-scope")]
public class QuotationScopeController(IQuotationScopeService service) : BaseChildController<QuotationScope, QuotationScopeResponseDto, CreateQuotationScopeDto>(service)
{
    [HttpGet("{serviceScopeId}/service-scope")]
    public async Task<IActionResult> GetByServiceScopeId(int serviceScopeId) => Ok(await service.GetByServiceScopeIdAsync(serviceScopeId));
    [HttpGet("{quotationItemId}/is-included")]
    public async Task<IActionResult> GetIncluded(int quotationItemId) => Ok(await service.GetIncludedAsync(quotationItemId));
    [HttpGet("{id}/quotation-scope-case")]
    public async Task<IActionResult> GetWithCases(int id) => Ok(await service.GetWithCasesAsync(id));
}
