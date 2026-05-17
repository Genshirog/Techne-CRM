using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceWaiverCaseService : ChildService<ServiceWaiverCase, ServiceWaiverCaseResponseDto, CreateServiceWaiverCaseDto>
{
    public ServiceWaiverCaseService(IChildRepository<ServiceWaiverCase, int> repo) : base(repo) {}


    protected override ServiceWaiverCaseResponseDto MapToResponse(ServiceWaiverCase entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Order = entity.Order
    };

    protected override ServiceWaiverCase MapToEntity(CreateServiceWaiverCaseDto dto) => new()
    {
        ServiceWaiverId = dto.ServiceWaiverId,
        Title = dto.Title,
        Order = dto.Order
    };
}
