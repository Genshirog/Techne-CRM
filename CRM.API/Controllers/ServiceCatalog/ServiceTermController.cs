using CRM.API.Controllers.ServiceCatalog;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-term")]
public class ServiceTermController(IChildService<ServiceTerm, ServiceTermResponseDto, CreateServiceTermDto> service)
: BaseChildController<ServiceTerm, ServiceTermResponseDto, CreateServiceTermDto>(service);