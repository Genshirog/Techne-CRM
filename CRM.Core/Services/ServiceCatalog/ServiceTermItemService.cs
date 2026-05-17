using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceTermItemService : ChildService<ServiceTermItem, ServiceTermItemResponseDto, CreateServiceTermItemDto>
{
    public ServiceTermItemService(IChildRepository<ServiceTermItem, int> repo) :base(repo) {}

    protected override ServiceTermItem MapToEntity(CreateServiceTermItemDto dto) => new()
    {
        ServiceTermId = dto.ServiceTermId,
        Content = dto.Content,
        Order = dto.Order
    };

    protected override ServiceTermItemResponseDto MapToResponse(ServiceTermItem entity) => new()
    {
        Id = entity.Id,
        Content = entity.Content,
        Order = entity.Order
    };
}
