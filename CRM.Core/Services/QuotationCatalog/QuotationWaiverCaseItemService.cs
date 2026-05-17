using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationWaiverCaseItemService : ChildService<QuotationWaiverCaseItem,QuotationWaiverCaseItemResponseDto, CreateQuotationWaiverCaseItemDto>, IQuotationWaiverCaseItemService
{
    private readonly IQuotationWaiverCaseItemRepository _repo;

    public QuotationWaiverCaseItemService(IQuotationWaiverCaseItemRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationWaiverCaseItemResponseDto>> GetByServiceWaiverCaseItemIdAsync(int serviceWaiverCaseItemId)
    {
        var entities = await _repo.GetByServiceWaiverCaseItemIdAsync(serviceWaiverCaseItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override QuotationWaiverCaseItem MapToEntity(CreateQuotationWaiverCaseItemDto dto) => new()
    {
        ServiceWaiverCaseItemId = dto.ServiceWaiverCaseItemId,
    };

    protected override QuotationWaiverCaseItemResponseDto MapToResponse(QuotationWaiverCaseItem entity) => new()
    {
        Id = entity.Id,
        ServiceWaiverCaseItemId = entity.ServiceWaiverCaseItemId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
