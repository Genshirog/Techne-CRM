using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-waiver-case-item")]
public class QuotationWaiverCaseItemController(IQuotationWaiverCaseItemService service) : BaseChildController<QuotationWaiverCaseItem, QuotationWaiverCaseItemResponseDto, CreateQuotationWaiverCaseItemDto>(service)
{
    [HttpGet("{serviceWaiverCaseItemId}/service-waiver-case-items")]
    public async Task<IActionResult> GetByServiceWaiverCaseItemId(int serviceWaiverCaseItemId) => Ok(await service.GetByServiceWaiverCaseItemIdAsync(serviceWaiverCaseItemId));
}
