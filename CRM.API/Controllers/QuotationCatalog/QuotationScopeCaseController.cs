using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-scope-case")]
public class QuotationScopeCaseController(IQuotationScopeCaseService service) : BaseChildController<QuotationScopeCase, QuotationScopeCaseResponseDto, CreateQuotationScopeCaseDto>(service)
{
    [HttpGet("{serviceScopeCaseId}/service-scope-case")]
    public async Task<IActionResult> GetByServiceScopeCaseId(int serviceScopeCaseId) => Ok(await service.GetByServiceScopeCaseIdAsync(serviceScopeCaseId));
    [HttpGet("{id}/quotation-scope-case-item")]
    public async Task<IActionResult> GetWithItems(int id) => Ok(await service.GetWithItemsAsync(id));
}
