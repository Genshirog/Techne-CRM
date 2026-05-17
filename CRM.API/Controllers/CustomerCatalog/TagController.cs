using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Services.CustomerCatalog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerCatalog;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[Route("api/tags")]
public class TagController(ITagService service) : BaseController<TagResponseDto, CreateTagDto, UpdateTagDto>(service)
{
}
