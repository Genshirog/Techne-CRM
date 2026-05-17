using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.JobOrderCatalog;
using CRM.Infrastructure.Repositories.JobOrderCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.JobOrderCatalog;

[Authorize]
[ApiController]
[Route("api/job-order-parts")]
public class JobOrderPartsController(IJobOrderPartService service) : BaseChildController<JobOrderPart, JobOrderPartResponseDto, CreateJobOrderPartDto>(service)
{
    [HttpGet("{jobOrderId}/total-parts")]
    public async Task<IActionResult> GetTotalPartsAmount(int jobOrderId) => Ok(await service.GetTotalPartsAmountAsync(jobOrderId));

    [Authorize(Roles = "Admin,SuperAdmin,Technician")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateJobOrderPartDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new {id = (result as dynamic).Id}, result);
        
    }

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }
}
