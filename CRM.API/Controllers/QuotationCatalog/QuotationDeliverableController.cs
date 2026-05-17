using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-deliverable")]
public class QuotationDeliverableController(IQuotationDeliverableService service) : BaseChildController<QuotationDeliverable, QuotationDeliverableResponseDto, CreateQuotationDeliverableDto>(service)
{
    [HttpGet("{serviceDeliverableId}/service-deliverable")]
    public async Task<IActionResult> GetByServiceDeliverableId(int serviceDeliverableId) => Ok(await service.GetByServiceDeliverableIdAsync(serviceDeliverableId));
    [HttpGet("{quotationItemId}/included")]
    public async Task<IActionResult> GetIncluded(int quotationItemId) => Ok(await service.GetIncludedAsync(quotationItemId));
}
