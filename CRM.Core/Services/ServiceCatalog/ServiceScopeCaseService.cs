using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories;

namespace CRM.Core.Services.ServiceCatalog;

public class ServiceScopeCaseService : ChildService<ServiceScopeCase, ServiceScopeCaseResponseDto, CreateServiceScopeCaseDto>
{
    public ServiceScopeCaseService(IChildRepository<ServiceScopeCase, int> repo) : base(repo){}

    protected override ServiceScopeCaseResponseDto MapToResponse(ServiceScopeCase entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Order = entity.Order
    };

    protected override ServiceScopeCase MapToEntity(CreateServiceScopeCaseDto dto) => new()
    {
        ServiceScopeId = dto.ServiceScopeId,
        Title = dto.Title,
        Order = dto.Order
    };
}
