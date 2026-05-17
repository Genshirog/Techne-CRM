using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationItemService : ChildService<QuotationItem, QuotationItemResponseDto, CreateQuotationItemDto>, IQuotationItemService
{
    private readonly IQuotationItemRepository _repo;

    public QuotationItemService(IQuotationItemRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationItemResponseDto>> GetByServiceIdAsync(int serviceId)
    {
        var entities = await _repo.GetByServiceIdAsync(serviceId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationItemResponseDto?> GetWithDeliverablesAsync(int id)
    {
        var entity = await _repo.GetWithDeliverablesAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationItemResponseDto?> GetWithDetailsAsync(int id)
    {
        var entity = await _repo.GetWithDetailAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationItemResponseDto?> GetWithScopesAsync(int id)
    {
        var entity = await _repo.GetWithScopesAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationItemResponseDto?> GetWithTermsAsync(int id)
    {
        var entity = await _repo.GetWithTermsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationItemResponseDto?> GetWithWaiversAsync(int id)
    {
        var entity = await _repo.GetWithWaiversAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override QuotationItem MapToEntity(CreateQuotationItemDto dto) => new()
    {
        Deliverables = dto.Deliverables?.Select(d => new QuotationDeliverable
        {
            ServiceDeliverableId = d.ServiceDeliverableId,
            IsIncluded = d.IsIncluded,
        }).ToList() ?? [],
        Details = dto.Details?.Select(d => new QuotationDetail
        {
            ItemName = d.ItemName,
            Quantity = d.Quantity,
            UnitPrice = d.UnitPrice,
        }).ToList() ?? [],
        Scopes = dto.Scopes?.Select(s => new QuotationScope
        {
            ServiceScopeId = s.ServiceScopeId,
            IsIncluded = s.IsIncluded,
            Cases = s.Cases?.Select(c => new QuotationScopeCase
            {
               ServiceScopeCaseId = c.ServiceScopeCaseId,
               Items = c.Items?.Select(i => new QuotationScopeCaseItem
               {
                   ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
               }).ToList() ?? [],
            }).ToList() ?? [],
        }).ToList() ?? [],
        ServiceId = dto.ServiceId,
        Terms = dto.Terms?.Select(t => new QuotationTerm
        {
            ServiceTermId = t.ServiceTermId,
            IsIncluded = t.IsIncluded,
            Items = t.Items?.Select(i => new QuotationTermItem{
                ServiceTermItemId = i.ServiceTermItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
        Waivers = dto.Waivers?.Select(w => new QuotationWaiver
        {
            ServiceWaiverId = w.ServiceWaiverId,
            IsIncluded = w.IsIncluded,
            Cases = w.Cases?.Select(c => new QuotationWaiverCase
            {
                ServiceWaiverCaseId = c.ServiceWaiverCaseId,
                Items = c.Items?.Select(i => new QuotationWaiverCaseItem
                {
                    ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId,
                }).ToList() ?? [],    
            }).ToList() ?? [],
        }).ToList() ?? [],
    };

    protected override QuotationItemResponseDto MapToResponse(QuotationItem entity) => new()
    {
        Id = entity.Id,
        Deliverables = entity.Deliverables?.Select(d => new QuotationDeliverableResponseDto
        {
            ServiceDeliverableId = d.ServiceDeliverableId,
            IsIncluded = d.IsIncluded,
        }).ToList() ?? [],
        Details = entity.Details?.Select(d => new QuotationDetailResponseDto
        {
            ItemName = d.ItemName,
            Quantity = d.Quantity,
            UnitPrice = d.UnitPrice,
        }).ToList() ?? [],
        Scopes = entity.Scopes?.Select(s => new QuotationScopeResponseDto
        {
            ServiceScopeId = s.ServiceScopeId,
            IsIncluded = s.IsIncluded,
            Cases = s.Cases?.Select(c => new QuotationScopeCaseResponseDto
            {
               ServiceScopeCaseId = c.ServiceScopeCaseId,
               Items = c.Items?.Select(i => new QuotationScopeCaseItemResponseDto
               {
                   ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
               }).ToList() ?? [],
            }).ToList() ?? [],
        }).ToList() ?? [],
        ServiceId = entity.ServiceId,
        Terms = entity.Terms?.Select(t => new QuotationTermResponseDto
        {
            ServiceTermId = t.ServiceTermId,
            IsIncluded = t.IsIncluded,
            Items = t.Items?.Select(i => new QuotationTermItemResponseDto{
                ServiceTermItemId = i.ServiceTermItemId,
            }).ToList() ?? [],
        }).ToList() ?? [],
        Waivers = entity.Waivers?.Select(w => new QuotationWaiverResponseDto
        {
            ServiceWaiverId = w.ServiceWaiverId,
            IsIncluded = w.IsIncluded,
            Cases = w.Cases?.Select(c => new QuotationWaiverCaseResponseDto
            {
                ServiceWaiverCaseId = c.ServiceWaiverCaseId,
                Items = c.Items?.Select(i => new QuotationWaiverCaseItemResponseDto
                {
                    ServiceWaiverCaseItemId = i.ServiceWaiverCaseItemId,
                }).ToList() ?? [],    
            }).ToList() ?? [],
        }).ToList() ?? [],    
    };
}
