using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationWaiverService : ChildService<QuotationWaiver, QuotationWaiverResponseDto, CreateQuotationWaiverDto>, IQuotationWaiverService
{
    private readonly IQuotationWaiverRepository _repo;

    public QuotationWaiverService(IQuotationWaiverRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationWaiverResponseDto>> GetByServiceWaiverIdAsync(int serviceWaiverId)
    {
        var entities = await _repo.GetByServiceWaiverIdAsync(serviceWaiverId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationWaiverResponseDto>> GetIncludedAsync(int quotationItemId)
    {
        var entities = await _repo.GetIncludedAsync(quotationItemId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationWaiverResponseDto?> GetWithCaseAsync(int id)
    {
        var entity = await _repo.GetWithCasesAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationWaiver MapToEntity(CreateQuotationWaiverDto dto) => new()
    {
        ServiceWaiverId = dto.ServiceWaiverId,
        IsIncluded = dto.IsIncluded,
        Cases = dto.Cases?.Select(c => new QuotationWaiverCase
        {
            ServiceWaiverCaseId = c.ServiceWaiverCaseId,
            Items = c.Items?.Select(i => new QuotationWaiverCaseItem
            {
                ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
    };

    protected override QuotationWaiverResponseDto MapToResponse(QuotationWaiver entity) => new()
    {
        Id = entity.Id,
        ServiceWaiverId = entity.ServiceWaiverId,
        IsIncluded = entity.IsIncluded,
        Cases = entity.Cases?.Select(c => new QuotationWaiverCaseResponseDto
        {
            ServiceWaiverCaseId = c.ServiceWaiverCaseId,
            Items = c.Items?.Select(i => new QuotationWaiverCaseItemResponseDto
            {
                ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
    };
}
