using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationTermItemService : ChildService<QuotationTermItem, QuotationTermItemResponseDto, CreateQuotationTermItemDto>, IQuotationTermItemService
{
    private readonly IQuotationTermItemRepository _repo;

    public QuotationTermItemService(IQuotationTermItemRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationTermItemResponseDto>> GetByServiceTermItemIdAsync(int serviceTermItemId)
    {
        var entities = await _repo.GetByServiceTermItemIdAsync(serviceTermItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override QuotationTermItem MapToEntity(CreateQuotationTermItemDto dto) => new()
    {
        ServiceTermItemId = dto.ServiceTermItemId,
    };

    protected override QuotationTermItemResponseDto MapToResponse(QuotationTermItem entity) => new()
    {
        Id = entity.Id,
        ServiceTermItemId = entity.ServiceTermItemId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
