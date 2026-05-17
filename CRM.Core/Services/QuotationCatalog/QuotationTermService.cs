using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationTermService : ChildService<QuotationTerm, QuotationTermResponseDto, CreateQuotationTermDto>, IQuotationTermService
{
    private readonly IQuotationTermRepository _repo;

    public QuotationTermService(IQuotationTermRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationTermResponseDto>> GetByServiceTermIdAsync(int serviceTermId)
    {
        var entities = await _repo.GetByServiceTermIdAsync(serviceTermId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationTermResponseDto>> GetIncludedAsync(int quotationItemId)
    {
        var entities = await _repo.GetByServiceTermIdAsync(quotationItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationTermResponseDto?> GetWithItemsAsync(int id)
    {
        var entity = await _repo.GetWithItemsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationTerm MapToEntity(CreateQuotationTermDto dto) => new()
    {
        ServiceTermId = dto.ServiceTermId,
        IsIncluded = dto.IsIncluded,
        Items = dto.Items?.Select(i => new QuotationTermItem
        {
            ServiceTermItemId = i.ServiceTermItemId,
        }).ToList() ?? [],
    };

    protected override QuotationTermResponseDto MapToResponse(QuotationTerm entity) => new()
    {
        Id = entity.Id,
        ServiceTermId = entity.ServiceTermId,
        IsIncluded = entity.IsIncluded,
        Items = entity.Items?.Select(i => new QuotationTermItemResponseDto
        {
            ServiceTermItemId = i.ServiceTermItemId,
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt,
    };
}
