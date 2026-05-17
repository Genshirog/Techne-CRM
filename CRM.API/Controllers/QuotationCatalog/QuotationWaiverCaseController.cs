using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-waiver-case")]
public class QuotationWaiverCaseController(IQuotationWaiverCaseService service) : BaseChildController<QuotationWaiverCase, QuotationWaiverCaseResponseDto, CreateQuotationWaiverCaseDto>(service)
{
    [HttpGet("{serviceWaiverCaseId}/service-waiver-case")]
    public async Task<IActionResult> GetByServiceWaiverCaseId(int serviceWaiverCaseId) => Ok(await service.GetByServiceWaiverCaseIdAsync(serviceWaiverCaseId));
    [HttpGet("{id}/quotation-waiver-items")]
    public async Task<IActionResult> GetWithItems(int id) => Ok(await service.GetWithItemsAsync(id));

}
