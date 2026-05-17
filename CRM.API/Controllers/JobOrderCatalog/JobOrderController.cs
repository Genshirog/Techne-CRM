using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.JobOrderCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.JobOrderCatalog;

[ApiController]
[Route("api/job-order")]
public class JobOrderController(IJobOrderService service) : BaseController<JobOrderResponseDto, CreateJobOrderDto, UpdateJobOrderDto>(service)
{
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{status}/job-status")]
    public async Task<IActionResult> GetByStatus(JobOrderStatus status) => Ok(await service.GetByStatusAsync(status));
    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpGet("{id}/technician")]
    public async Task<IActionResult> GetByTechnician(int id) => Ok(await service.GetByTechnicianIdAsync(id));
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{quotationId}/quotation")]
    public async Task<IActionResult> GetByQuotation(int quotationId) => Ok(await service.GetByQuotationAsync(quotationId));
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{id}/job-order-parts")]
    public async Task<IActionResult> GetWithParts(int id) => Ok(await service.GetWithPartsAsync(id));
    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpGet("{id}/job-order-reports")]
    public async Task<IActionResult> GetWithReports(int id) => Ok(await service.GetWithReportsAsync(id));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateJobOrderDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateJobOrderDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
