using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-deliverable")]
public class ServiceDeliverableController(IChildService<ServiceDeliverable, ServiceDeliverableResponseDto, CreateServiceDeliverableDto> service)
: BaseChildController<ServiceDeliverable, ServiceDeliverableResponseDto, CreateServiceDeliverableDto>(service);
