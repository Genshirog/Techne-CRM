using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.QuotationCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.QuotationCatalog;

[Authorize(Roles = "Admin,SuperAdmin,Technician")]
[ApiController]
[Route("api/quotations")]
public class QuotationController(IQuotationService service) : BaseController<QuotationResponseDto, CreateQuotationDto, UpdateQuotationDto>(service)
{
    [HttpGet("{inquiryId}/inquiry")]
    public async Task<IActionResult> GetByInquiryId(int inquiryId) => Ok(await service.GetByInquiryIdAsync(inquiryId));
    [HttpGet("{customerId}/customer")]
    public async Task<IActionResult> GetByCustomerId(int customerId) => Ok(await service.GetByCustomerIdAsync(customerId));
    [HttpGet("{companyId}/company")]
    public async Task<IActionResult> GetByCompanyId(int companyId) => Ok(await service.GetByCompanyIdAsync(companyId));
    [HttpGet("{technicianId}/technician")]
    public async Task<IActionResult> GetByTechnicianId(int technicianId) => Ok(await service.GetByTechnicianIdAsync(technicianId));
    [HttpGet("{status}/quotation-status")]
    public async Task<IActionResult> GetByStatus(QuotationStatus status) => Ok(await service.GetByStatusAsync(status));
    [HttpGet("{id}/quotation-items")]
    public async Task<IActionResult> GetWithItems(int id) => Ok(await service.GetWithItemsAsync(id));
    [HttpGet("{id}/quotation-snapshot")]
    public async Task<IActionResult> GetWithSnapshot(int id) => Ok(await service.GetWithSnapshotAsync(id));
    [HttpGet("{id}/quotation-signature")]
    public async Task<IActionResult> GetWithSignature(int id) => Ok(await service.GetWithSignatureAsync(id));
}
