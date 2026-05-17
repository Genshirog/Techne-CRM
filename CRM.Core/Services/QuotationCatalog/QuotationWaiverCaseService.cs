using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationWaiverCaseService : ChildService<QuotationWaiverCase, QuotationWaiverCaseResponseDto, CreateQuotationWaiverCaseDto>, IQuotationWaiverCaseService
{
    private readonly IQuotationWaiverCaseRepository _repo;

    public QuotationWaiverCaseService(IQuotationWaiverCaseRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationWaiverCaseResponseDto>> GetByServiceWaiverCaseIdAsync(int serviceWaiverCaseId)
    {
        var entities = await _repo.GetByServiceWaiverCaseIdAsync(serviceWaiverCaseId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationWaiverCaseResponseDto?> GetWithItemsAsync(int quotationItemId)
    {
        var entity = await _repo.GetWithItemsAsync(quotationItemId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationWaiverCase MapToEntity(CreateQuotationWaiverCaseDto dto) => new()
    {
        ServiceWaiverCaseId = dto.ServiceWaiverCaseId,
        Items = dto.Items?.Select(i => new QuotationWaiverCaseItem
        {
           ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId, 
        }).ToList() ?? [],
    };

    protected override QuotationWaiverCaseResponseDto MapToResponse(QuotationWaiverCase entity) => new()
    {
        Id = entity.Id,
        ServiceWaiverCaseId = entity.ServiceWaiverCaseId,
        Items = entity.Items?.Select(i => new QuotationWaiverCaseItemResponseDto
        {
           ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId, 
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
