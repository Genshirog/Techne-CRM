using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-waiver")]
public class QuotationWaiverController(IQuotationWaiverService service) : BaseChildController<QuotationWaiver, QuotationWaiverResponseDto, CreateQuotationWaiverDto>(service)
{
    [HttpGet("{serviceWaiverId}/service-waiver")]
    public async Task<IActionResult> GetByServiceWaiverId(int serviceWaiverId) => Ok(await service.GetByServiceWaiverIdAsync(serviceWaiverId));
    [HttpGet("{quotationItemId}/is-included")]
    public async Task<IActionResult> GetIncluded(int quotationItemId) => Ok(await service.GetIncludedAsync(quotationItemId));
    [HttpGet("{id}/quotation-waiver-case")]
    public async Task<IActionResult> GetWithCase(int id) => Ok(await service.GetWithCaseAsync(id));
}
