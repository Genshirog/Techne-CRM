using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-waiver-case")]
public class ServiceWaiverCaseController(IChildService<ServiceWaiverCase, ServiceWaiverCaseResponseDto, CreateServiceWaiverCaseDto> service)
: BaseChildController<ServiceWaiverCase, ServiceWaiverCaseResponseDto, CreateServiceWaiverCaseDto>(service);