using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationScopeService : ChildService<QuotationScope, QuotationScopeResponseDto, CreateQuotationScopeDto>, IQuotationScopeService
{
    private readonly IQuotationScopeRepository _repo;

    public QuotationScopeService(IQuotationScopeRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationScopeResponseDto>> GetByServiceScopeIdAsync(int serviceScopeId)
    {
        var entities = await _repo.GetByServiceScopeIdAsync(serviceScopeId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationScopeResponseDto>> GetIncludedAsync(int quotationItemId)
    {
        var entities = await _repo.GetByServiceScopeIdAsync(quotationItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationScopeResponseDto?> GetWithCasesAsync(int id)
    {
        var entity = await _repo.GetWithCasesAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationScope MapToEntity(CreateQuotationScopeDto dto) => new()
    {
        ServiceScopeId = dto.ServiceScopeId,
        IsIncluded = dto.IsIncluded,
        Cases = dto.Cases?.Select(c => new QuotationScopeCase
        {
            ServiceScopeCaseId = c.ServiceScopeCaseId,
            Items = c.Items?.Select(i => new QuotationScopeCaseItem
            {
                ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
    };

    protected override QuotationScopeResponseDto MapToResponse(QuotationScope entity) => new()
    {
        Id = entity.Id,
        ServiceScopeId = entity.ServiceScopeId,
        IsIncluded = entity.IsIncluded,
        Cases = entity.Cases?.Select(c => new QuotationScopeCaseResponseDto
        {
            ServiceScopeCaseId = c.ServiceScopeCaseId,
            Items = c.Items?.Select(i => new QuotationScopeCaseItemResponseDto
            {
                ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
    };
}
