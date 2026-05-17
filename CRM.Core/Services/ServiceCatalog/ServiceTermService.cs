using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceTermService : ChildService<ServiceTerm, ServiceTermResponseDto, CreateServiceTermDto>
{
    public ServiceTermService(IChildRepository<ServiceTerm, int> repo) : base(repo) {}


    protected override ServiceTerm MapToEntity(CreateServiceTermDto dto) => new()
    {
        ServiceId = dto.ServiceId,
        Title = dto.Title,
        Order = dto.Order
    };

    protected override ServiceTermResponseDto MapToResponse(ServiceTerm entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Order = entity.Order
    };
}
