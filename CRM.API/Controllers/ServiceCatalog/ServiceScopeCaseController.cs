using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using CRM.Core.Services.ServiceCatalog;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-scope-case")]
public class ServiceScopeCaseController(IChildService<ServiceScopeCase, ServiceScopeCaseResponseDto, CreateServiceScopeCaseDto> service)
:BaseChildController<ServiceScopeCase, ServiceScopeCaseResponseDto, CreateServiceScopeCaseDto>(service);
