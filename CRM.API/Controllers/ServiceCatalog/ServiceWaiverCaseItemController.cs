using CRM.Core.Services;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-waiver-case-item")]
public class ServiceWaiverCaseItemController(IChildService<ServiceWaiverCaseItem, ServiceWaiverCaseItemResponseDto, CreateServiceWaiverCaseItemDto> service)
: BaseChildController<ServiceWaiverCaseItem, ServiceWaiverCaseItemResponseDto, CreateServiceWaiverCaseItemDto>(service);