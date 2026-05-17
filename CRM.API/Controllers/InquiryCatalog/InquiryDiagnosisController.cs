using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.InquiryCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.InquiryCatalog;

[ApiController]
[Route("api/inquiry-diagnosis")]
public class InquiryDiagnosisController(IInquiryDiagnosisService service) : BaseChildController<InquiryDiagnosis, InquiryDiagnosisResponseDto, CreateInquiryDiagnosisDto>(service)
{
    [HttpGet("{diagnosisId}/diagnosis")]
    public async Task<IActionResult> GetByDiagnosisId(int diagnosisId) => Ok(await service.GetByDiagnosisCatalogId(diagnosisId));

    [Authorize(Roles = "Admin,SuperAdmin")]
    [HttpPost]
    public override async Task<IActionResult> Create(CreateInquiryDiagnosisDto dto)
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
