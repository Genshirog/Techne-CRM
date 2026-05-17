using CRM.Core.DTOs.ServiceAgreementCatalog;
using CRM.Core.Entities;
using CRM.Core.Services.ServiceAgreementCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceAgreementCatalog;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[Route("api/service-agreement")]
public class ServiceAgreementController(IServiceAgreementService service) : BaseController<ServiceAgreementResponseDto, CreateServiceAgreementDto, UpdateServiceAgreementDto>(service)
{
    [HttpGet("{jobOrderId}/job-order")]
    public async Task<IActionResult> GetByJobOrderId(int jobOrderId) => Ok(await service.GetByJobOrderIdAsync(jobOrderId));
    [HttpGet("{quotationId}/quotation")]
    public async Task<IActionResult> GetByQuotationId(int quotationId) => Ok(await service.GetByQuotationIdAsync(quotationId));
    [HttpGet("{status}/service-agreement-status")]
    public async Task<IActionResult> GetByStatus(ServiceAgreementStatus status) => Ok(await service.GetByStatusAsync(status));
    [HttpGet("{id}/signature")]
    public async Task<IActionResult> GetWithSignature(int id) => Ok(await service.GetWithSignatureAsync(id));
}
