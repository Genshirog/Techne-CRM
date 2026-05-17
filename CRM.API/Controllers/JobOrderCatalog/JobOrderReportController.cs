using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.JobOrderCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.JobOrderCatalog;

[Authorize]
[ApiController]
[Route("api/job-order-reports")]
public class JobOrderReportController(IJobOrderReportService service) : BaseChildController<JobOrderReport, JobOrderReportResponseDto, CreateJobOrderReportDto>(service)
{
    [HttpGet("{quotationId}/quotation-item")]
    public async Task<IActionResult> GetByQuotationItem(int quotationId) => Ok(await service.GetByQuotationItemAsync(quotationId));
}
