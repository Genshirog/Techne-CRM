using CRM.Core;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[Route ("api/services-scope-case-item")]
public class ServiceScopeCaseItemController(IChildService<ServiceScopeCaseItem, ServiceScopeCaseItemResponseDto, CreateServiceScopeCaseItemDto> service)
: BaseChildController<ServiceScopeCaseItem, ServiceScopeCaseItemResponseDto, CreateServiceScopeCaseItemDto>(service);
