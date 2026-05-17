using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationScopeCaseService : ChildService<QuotationScopeCase, QuotationScopeCaseResponseDto, CreateQuotationScopeCaseDto>, IQuotationScopeCaseService
{
    private readonly IQuotationScopeCaseRepository _repo;

    public QuotationScopeCaseService(IQuotationScopeCaseRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationScopeCaseResponseDto>> GetByServiceScopeCaseIdAsync(int serviceScopeCaseId)
    {
        var entities = await _repo.GetByServiceScopeCaseIdAsync(serviceScopeCaseId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationScopeCaseResponseDto?> GetWithItemsAsync(int id)
    {
        var entity = await _repo.GetWithItemsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationScopeCase MapToEntity(CreateQuotationScopeCaseDto dto) => new()
    {
        ServiceScopeCaseId = dto.ServiceScopeCaseId,
        Items = dto.Items?.Select(i => new QuotationScopeCaseItem
        {
            ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
        }).ToList() ?? [],
    };

    protected override QuotationScopeCaseResponseDto MapToResponse(QuotationScopeCase entity) => new()
    {
        Id = entity.Id,
        ServiceScopeCaseId = entity.ServiceScopeCaseId,
        Items = entity.Items?.Select(i => new QuotationScopeCaseItemResponseDto
        {
            ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
