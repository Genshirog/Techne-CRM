using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-term")]
public class QuotationTermController(IQuotationTermService service): BaseChildController<QuotationTerm, QuotationTermResponseDto, CreateQuotationTermDto>(service)
{
    [HttpGet("{serviceTermId}/service-term")]
    public async Task<IActionResult> GetByServiceTermId(int serviceTermId) => Ok(await service.GetByServiceTermIdAsync(serviceTermId));
    [HttpGet("{quotationItemId}/is-included")]
    public async Task<IActionResult> GetIncluded(int quotationItemId) => Ok(await service.GetIncludedAsync(quotationItemId));
    [HttpGet("{id}/quotation-term-items")]
    public async Task<IActionResult> GetWithItems(int id) => Ok(await service.GetWithItemsAsync(id));
}
