using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceScopeCaseItemService : ChildService<ServiceScopeCaseItem, ServiceScopeCaseItemResponseDto, CreateServiceScopeCaseItemDto>
{
    public ServiceScopeCaseItemService(IChildRepository<ServiceScopeCaseItem, int> repo) : base(repo){}

    protected override ServiceScopeCaseItemResponseDto MapToResponse(ServiceScopeCaseItem entity) => new()
    {
        Id = entity.Id,
        Content = entity.Content,
        Order = entity.Order
    };

    protected override ServiceScopeCaseItem MapToEntity(CreateServiceScopeCaseItemDto dto) => new()
    {
        ServiceScopeCaseId = dto.ServiceScopeCaseId,
        Content = dto.Content,
        Order = dto.Order
    };
}
