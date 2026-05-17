using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-term-item")]
public class QuotationTermItemController(IQuotationTermItemService service) : BaseChildController<QuotationTermItem, QuotationTermItemResponseDto, CreateQuotationTermItemDto>(service)
{
    [HttpGet("{serviceTermItemId}/service-term-item")]
    public async Task<IActionResult> GetByServiceTermItemId(int serviceTermItemId) => Ok(await service.GetByServiceTermItemIdAsync(serviceTermItemId));
}
