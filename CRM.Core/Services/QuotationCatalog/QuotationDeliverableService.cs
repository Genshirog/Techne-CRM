using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationDeliverableService : ChildService<QuotationDeliverable, QuotationDeliverableResponseDto, CreateQuotationDeliverableDto>, IQuotationDeliverableService
{
    private readonly IQuotationDeliverableRepository _repo;

    public QuotationDeliverableService(IQuotationDeliverableRepository repo) : base(repo)
    {
        _repo = repo;    
    }

    public async Task<IEnumerable<QuotationDeliverableResponseDto>> GetByServiceDeliverableIdAsync(int serviceDeliverableId)
    {
        var entities = await _repo.GetByServiceDeliverableIdAsync(serviceDeliverableId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationDeliverableResponseDto>> GetIncludedAsync(int quotationItemId)
    {
        var entities = await _repo.GetIncludedAsync(quotationItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override QuotationDeliverable MapToEntity(CreateQuotationDeliverableDto dto) => new()
    {
        IsIncluded = dto.IsIncluded,
        ServiceDeliverableId = dto.ServiceDeliverableId
    };

    protected override QuotationDeliverableResponseDto MapToResponse(QuotationDeliverable entity) => new()
    {
        Id = entity.Id,
        IsIncluded = entity.IsIncluded,
        ServiceDeliverableId = entity.ServiceDeliverableId,
        QuotationItemId = entity.QuotationItemId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
