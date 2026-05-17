using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationService : GeneralService<Quotation,QuotationResponseDto,CreateQuotationDto, UpdateQuotationDto>, IQuotationService
{
    private readonly IQuotationRepository _repo;

    public QuotationService(IQuotationRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<QuotationResponseDto>> GetByCompanyIdAsync(int companyId)
    {
        var entities = await _repo.GetByCompanyIdAsync(companyId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerIdAsync(customerId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationResponseDto>> GetByInquiryIdAsync(int inquiryId)
    {
        var entities = await _repo.GetByInquiryIdAsync(inquiryId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationResponseDto>> GetByStatusAsync(QuotationStatus status)
    {
        var entities = await _repo.GetByStatusAsync(status) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<QuotationResponseDto>> GetByTechnicianIdAsync(int technicianId)
    {
        var entities = await _repo.GetByTechnicianIdAsync(technicianId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<QuotationResponseDto?> GetWithItemsAsync(int id)
    {
        var entity = await _repo.GetWithItemsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationResponseDto?> GetWithSignatureAsync(int id)
    {
        var entity = await _repo.GetWithSignatureAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<QuotationResponseDto?> GetWithSnapshotAsync(int id)
    {
        var entity = await _repo.GetWithSnapshotsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override Quotation MapToEntity(CreateQuotationDto request) => new()
    {
        ApprovedBy = request.ApprovedBy,
        CompanyId = request.CompanyId,
        CustomerId = request.CustomerId,
        DiagnosisFee = request.DiagnosisFee,
        InquiryId = request.InquiryId,
        GrandTotal = request.GrandTotal,
        LaborEstimate = request.LaborEstimate,
        PartsEstimate = request.PartsEstimate,
        QuotationItems = request.QuotationItems?.Select(q => new QuotationItem
        {
            Deliverables = q.Deliverables?.Select(d => new QuotationDeliverable
            {
                ServiceDeliverableId = d.ServiceDeliverableId,
                IsIncluded = d.IsIncluded,
            }).ToList() ?? [],
            Details = q.Details?.Select(x => new QuotationDetail
            {
                ItemName = x.ItemName,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
            }).ToList() ?? [],
            Scopes = q.Scopes?.Select(s => new QuotationScope
            {
                Cases = s.Cases?.Select(c => new QuotationScopeCase
                {
                    ServiceScopeCaseId = c.ServiceScopeCaseId,
                    Items = c.Items?.Select(i => new QuotationScopeCaseItem
                    {
                        ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
                    }).ToList() ?? [],
                }).ToList() ?? [],
                IsIncluded = s.IsIncluded,
                ServiceScopeId = s.ServiceScopeId
            }).ToList() ?? [],
            ServiceId = q.ServiceId,
            Terms = q.Terms?.Select(t => new QuotationTerm
            {
                ServiceTermId = t.ServiceTermId,
                Items = t.Items?.Select(i => new QuotationTermItem
                {
                    ServiceTermItemId = i.ServiceTermItemId,
                }).ToList() ?? [],
                IsIncluded = t.IsIncluded,
            }).ToList() ?? [],
            Waivers = q.Waivers?.Select(w => new QuotationWaiver
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
        }).ToList() ?? [],
        TechnicianId = request.TechnicianId,
    };

    public override QuotationResponseDto MapToResponse(Quotation entity) => new()
    {
        Id = entity.Id,
        ApprovedBy = entity.ApprovedBy,
        CompanyId = entity.CompanyId,
        CustomerId = entity.CustomerId,
        DiagnosisFee = entity.DiagnosisFee,
        InquiryId = entity.InquiryId,
        GrandTotal = entity.GrandTotal,
        LaborEstimate = entity.LaborEstimate,
        PartsEstimate = entity.PartsEstimate,
        QuotationItems = entity.QuotationItems?.Select(q => new QuotationItemResponseDto
        {
            Deliverables = q.Deliverables?.Select(d => new QuotationDeliverableResponseDto
            {
                ServiceDeliverableId = d.ServiceDeliverableId,
                IsIncluded = d.IsIncluded,
            }).ToList() ?? [],
            Details = q.Details?.Select(x => new QuotationDetailResponseDto
            {
                ItemName = x.ItemName,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
            }).ToList() ?? [],
            Scopes = q.Scopes?.Select(s => new QuotationScopeResponseDto
            {
                Cases = s.Cases?.Select(c => new QuotationScopeCaseResponseDto
                {
                    ServiceScopeCaseId = c.ServiceScopeCaseId,
                    Items = c.Items?.Select(i => new QuotationScopeCaseItemResponseDto
                    {
                        ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
                    }).ToList() ?? [],
                }).ToList() ?? [],
                IsIncluded = s.IsIncluded,
                ServiceScopeId = s.ServiceScopeId
            }).ToList() ?? [],
            ServiceId = q.ServiceId,
            Terms = q.Terms?.Select(t => new QuotationTermResponseDto
            {
                ServiceTermId = t.ServiceTermId,
                Items = t.Items?.Select(i => new QuotationTermItemResponseDto
                {
                    ServiceTermItemId = i.ServiceTermItemId,
                }).ToList() ?? [],
                IsIncluded = t.IsIncluded,
            }).ToList() ?? [],
            Waivers = q.Waivers?.Select(w => new QuotationWaiverResponseDto
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
        }).ToList() ?? [],
        TechnicianId = entity.TechnicianId,
    };

    public override async Task<QuotationResponseDto> UpdateAsync(UpdateQuotationDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");

        entity.ApprovedBy = request.ApprovedBy;
        entity.CompanyId = request.CompanyId;
        entity.CustomerId = request.CustomerId;
        entity.DiagnosisFee = request.DiagnosisFee;
        entity.InquiryId = request.InquiryId;
        entity.GrandTotal = request.GrandTotal;
        entity.LaborEstimate = request.LaborEstimate;
        entity.PartsEstimate = request.PartsEstimate;
        entity.QuotationItems = request.QuotationItems?.Select(q => new QuotationItem
        {
            Deliverables = q.Deliverables?.Select(d => new QuotationDeliverable
            {
                ServiceDeliverableId = d.ServiceDeliverableId,
                IsIncluded = d.IsIncluded,
            }).ToList() ?? [],
            Details = q.Details?.Select(x => new QuotationDetail
            {
                ItemName = x.ItemName,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
            }).ToList() ?? [],
            Scopes = q.Scopes?.Select(s => new QuotationScope
            {
                Cases = s.Cases?.Select(c => new QuotationScopeCase
                {
                    ServiceScopeCaseId = c.ServiceScopeCaseId,
                    Items = c.Items?.Select(i => new QuotationScopeCaseItem
                    {
                        ServiceScopeCaseItemId = i.ServiceScopeCaseItemId,
                    }).ToList() ?? [],
                }).ToList() ?? [],
                IsIncluded = s.IsIncluded,
                ServiceScopeId = s.ServiceScopeId
            }).ToList() ?? [],
            ServiceId = q.ServiceId,
            Terms = q.Terms?.Select(t => new QuotationTerm
            {
                ServiceTermId = t.ServiceTermId,
                Items = t.Items?.Select(i => new QuotationTermItem
                {
                    ServiceTermItemId = i.ServiceTermItemId,
                }).ToList() ?? [],
                IsIncluded = t.IsIncluded,
            }).ToList() ?? [],
            Waivers = q.Waivers?.Select(w => new QuotationWaiver
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
        }).ToList() ?? [];
        entity.TechnicianId = request.TechnicianId;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);     
    }
}
