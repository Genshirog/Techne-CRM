using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceWaiverService : ChildService<ServiceWaiver, ServiceWaiverResponseDto, CreateServiceWaiverDto>
{
    public ServiceWaiverService(IChildRepository<ServiceWaiver, int> repo) : base(repo) {}


    protected override ServiceWaiverResponseDto MapToResponse(ServiceWaiver entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Order = entity.Order
    };

    protected override ServiceWaiver MapToEntity(CreateServiceWaiverDto dto) => new()
    {
        ServiceId = dto.ServiceId,
        Title = dto.Title,
        Order = dto.Order
    };
}
