using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotation-detail")]
public class QuotationDetailController(IQuotationDetailService service) : BaseChildController<QuotationDetail, QuotationDetailResponseDto, CreateQuotationDetailDto>(service)
{
    [HttpGet("{quotationItemId}/total-amount")]
    public async Task<IActionResult> GetTotalAmount(int quotationItemId) => Ok(await service.GetTotalAmountAsync(quotationItemId));
}
