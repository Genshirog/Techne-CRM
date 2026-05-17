using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-scope-case-items")]
public class QuotationScopeCaseItemController(IQuotationScopeCaseItemService service) : BaseChildController<QuotationScopeCaseItem,QuotationScopeCaseItemResponseDto, CreateQuotationScopeCaseItemDto>(service)
{
    [HttpGet("{serviceScopeCaseItemId}/service-scope-case-items")]
    public async Task<IActionResult> GetByServiceScopeCaseItemId(int serviceScopeCaseItemId) => Ok(await service.GetByServiceScopeCaseItemIdAsync(serviceScopeCaseItemId));
}
