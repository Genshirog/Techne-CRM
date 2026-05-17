using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.ServiceCatalog;

[ApiController]
[Route ("api/services-term-item")]
public class ServiceTermItemController(IChildService<ServiceTermItem,ServiceTermItemResponseDto, CreateServiceTermItemDto> service)
: BaseChildController<ServiceTermItem,ServiceTermItemResponseDto, CreateServiceTermItemDto>(service);
