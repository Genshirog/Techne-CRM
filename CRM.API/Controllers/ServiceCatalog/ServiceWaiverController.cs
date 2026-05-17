using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-waiver")]
public class ServiceWaiverController(IChildService<ServiceWaiver, ServiceWaiverResponseDto, CreateServiceWaiverDto> service)
: BaseChildController<ServiceWaiver, ServiceWaiverResponseDto, CreateServiceWaiverDto>(service);