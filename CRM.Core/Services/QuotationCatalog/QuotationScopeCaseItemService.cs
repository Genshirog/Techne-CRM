using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationScopeCaseItemService : ChildService<QuotationScopeCaseItem,QuotationScopeCaseItemResponseDto, CreateQuotationScopeCaseItemDto>, IQuotationScopeCaseItemService
{
    private readonly IQuotationScopeCaseItemRepository _repo;

    public QuotationScopeCaseItemService(IQuotationScopeCaseItemRepository repo) : base(repo)
    {
        _repo = repo;
    }

    protected override QuotationScopeCaseItem MapToEntity(CreateQuotationScopeCaseItemDto dto) => new()
    {
        ServiceScopeCaseItemId = dto.ServiceScopeCaseItemId
    };

    protected override QuotationScopeCaseItemResponseDto MapToResponse(QuotationScopeCaseItem entity) => new()
    {
        Id = entity.Id,
        QuotationScopeCaseId = entity.QuotationScopeCaseId,
        ServiceScopeCaseItemId = entity.ServiceScopeCaseItemId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    public async Task<IEnumerable<QuotationScopeCaseItemResponseDto>> GetByServiceScopeCaseItemIdAsync(int serviceScopeCaseItemId)
    {
        var entities = await _repo.GetByServiceScopeCaseItemIdAsync(serviceScopeCaseItemId);
        return entities.Select(MapToResponse);
    }
}
