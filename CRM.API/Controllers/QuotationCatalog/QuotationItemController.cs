using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-items")]
public class QuotationItemController(IQuotationItemService service) : BaseChildController<QuotationItem, QuotationItemResponseDto, CreateQuotationItemDto>(service)
{
    [HttpGet("{serviceId}/services")]
    public async Task<IActionResult> GetByServiceId(int serviceId) => Ok(await service.GetByServiceIdAsync(serviceId));
    [HttpGet("{id}/quotation-scopes")]
    public async Task<IActionResult> GetWithScopes(int id) => Ok(await service.GetWithScopesAsync(id));
    [HttpGet("{id}/quotation-waivers")]
    public async Task<IActionResult> GetWithWaivers(int id) => Ok(await service.GetWithWaiversAsync(id));
    [HttpGet("{id}/quotation-terms")]
    public async Task<IActionResult> GetWithTerms(int id) => Ok(await service.GetWithTermsAsync(id));
    [HttpGet("{id}/quotation-deliverables")]
    public async Task<IActionResult> GetWithDeliverables(int id) => Ok(await service.GetWithDeliverablesAsync(id));
    [HttpGet("{id}/quotation-details")]
    public async Task<IActionResult> GetWithDetails(int id) => Ok(await service.GetWithDetailsAsync(id));
}
