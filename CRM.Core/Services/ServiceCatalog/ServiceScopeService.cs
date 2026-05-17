using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceScopeService : ChildService<ServiceScope, ServiceScopeResponseDto, CreateServiceScopeDto>
{
    public ServiceScopeService(IChildRepository<ServiceScope, int> repo) : base(repo){}

    protected override ServiceScope MapToEntity(CreateServiceScopeDto dto) => new()
    {
        ServiceId = dto.ServiceId,
        Title = dto.Title,
        Order = dto.Order
    };

    protected override ServiceScopeResponseDto MapToResponse(ServiceScope entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Order = entity.Order
    };
}
