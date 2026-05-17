using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceWaiverCaseItemService : ChildService<ServiceWaiverCaseItem, ServiceWaiverCaseItemResponseDto, CreateServiceWaiverCaseItemDto>
{
    public ServiceWaiverCaseItemService(IChildRepository<ServiceWaiverCaseItem, int> repo) : base(repo) {}


    protected override ServiceWaiverCaseItem MapToEntity(CreateServiceWaiverCaseItemDto dto) => new()
    {
        ServiceWaiverCaseId = dto.ServiceWaiverCaseId,
        Content = dto.Content,
        Order = dto.Order
    };

    protected override ServiceWaiverCaseItemResponseDto MapToResponse(ServiceWaiverCaseItem entity) => new()
    {
        Id = entity.Id,
        Content = entity.Content,
        Order = entity.Order
    };

}
