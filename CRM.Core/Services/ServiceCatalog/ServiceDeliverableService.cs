using CRM.Core.Repositories;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceDeliverableService : ChildService<ServiceDeliverable, ServiceDeliverableResponseDto, CreateServiceDeliverableDto>
{
    public ServiceDeliverableService(IChildRepository<ServiceDeliverable, int> repo) : base(repo) {}

    protected override ServiceDeliverable MapToEntity(CreateServiceDeliverableDto dto) => new()
    {
        ServiceId = dto.ServiceId,
        Content = dto.Content,
        Order = dto.Order
    };

    protected override ServiceDeliverableResponseDto MapToResponse(ServiceDeliverable entity) => new()
    {
        Id = entity.Id,
        Content = entity.Content,
        Order = entity.Order
    };
}
