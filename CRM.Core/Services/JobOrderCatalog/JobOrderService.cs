using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;

namespace CRM.Core.Services.JobOrderCatalog;

public class JobOrderService : GeneralService<JobOrder, JobOrderResponseDto, CreateJobOrderDto, UpdateJobOrderDto>, IJobOrderService
{
    private readonly IJobOrderRepository _repo;
    
    public JobOrderService(IJobOrderRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<JobOrderResponseDto>> GetByStatusAsync(JobOrderStatus status)
    {
        var entities = await _repo.GetByStatusAsync(status) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<JobOrderResponseDto>> GetByTechnicianIdAsync(int technicianId)
    {
        var entities = await _repo.GetByTechnicianIdAsync(technicianId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<JobOrderResponseDto?> GetWithPartsAsync(int id)
    {
        var entity = await _repo.GetWithPartsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<JobOrderResponseDto?> GetByQuotationAsync(int quotationId)
    {
        var entity = await _repo.GetByQuotationIdAsync(quotationId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<JobOrderResponseDto?> GetWithReportsAsync(int id)
    {
        var entity = await _repo.GetWithReportsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override JobOrder MapToEntity(CreateJobOrderDto request) => new()
    {
        AssignedAt = request.AssignedAt,
        AssignedBy = request.AssignedBy,
        ExpectedFinishedDate = request.ExpectedFinishedDate,
        Parts = request.Parts?.Select(p => new JobOrderPart
        {
            PartName = p.PartName,
            Quantity = p.Quantity,
            UnitPrice = p.UnitPrice
        }).ToList() ?? [],
        QuotationId = request.QuotationId,
        Reports = request.Reports?.Select(r => new JobOrderReport
        {
            ActionsTaken =r.ActionsTaken,
            QuotationItemId = r.QuotationItemId,
            Recommendation = r.Recommendation,
        }).ToList() ?? [],
        StartDate = request.StartDate,
        TechnicianId = request.TechnicianId,
        TechnicianNotes = request.TechnicianNotes
    };

    public override JobOrderResponseDto MapToResponse(JobOrder entity) => new()
    {
        Id = entity.Id,
        AssignedAt = entity.AssignedAt,
        AssignedBy = entity.AssignedBy,
        ExpectedFinishedDate = entity.ExpectedFinishedDate,
        Parts = entity.Parts?.Select(p => new JobOrderPartResponseDto
        {
            PartName = p.PartName,
            Quantity = p.Quantity,
            UnitPrice = p.UnitPrice
        }).ToList() ?? [],
        QuotationId = entity.QuotationId,
        Reports = entity.Reports?.Select(r => new JobOrderReportResponseDto
        {
            ActionsTaken =r.ActionsTaken,
            QuotationItemId = r.QuotationItemId,
            Recommendation = r.Recommendation,
        }).ToList() ?? [],
        StartDate = entity.StartDate,
        TechnicianId = entity.TechnicianId,
        TechnicianNotes = entity.TechnicianNotes
    };

    public override async Task<JobOrderResponseDto> UpdateAsync(UpdateJobOrderDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");

        entity.AssignedAt = request.AssignedAt;
        entity.AssignedBy = request.AssignedBy;
        entity.ExpectedFinishedDate = request.ExpectedFinishedDate;
        entity.Parts = request.Parts?.Select(p => new JobOrderPart
        {
            PartName = p.PartName,
            Quantity = p.Quantity,
            UnitPrice = p.UnitPrice
        }).ToList() ?? [];
        entity.QuotationId = request.QuotationId;
        entity.Reports = request.Reports?.Select(r => new JobOrderReport
        {
            ActionsTaken =r.ActionsTaken,
            QuotationItemId = r.QuotationItemId,
            Recommendation = r.Recommendation,
        }).ToList() ?? [];
        entity.StartDate = request.StartDate;
        entity.TechnicianId = request.TechnicianId;
        entity.TechnicianNotes = request.TechnicianNotes;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
