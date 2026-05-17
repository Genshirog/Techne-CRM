using CRM.Core;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-scope")]
public class ServiceScopeController (IChildService<ServiceScope, ServiceScopeResponseDto, CreateServiceScopeDto> service) 
: BaseChildController<ServiceScope, ServiceScopeResponseDto, CreateServiceScopeDto> (service);
