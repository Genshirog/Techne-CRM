using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;

namespace CRM.Core.Services.JobOrderCatalog;

public class JobOrderReportService : ChildService<JobOrderReport, JobOrderReportResponseDto, CreateJobOrderReportDto>, IJobOrderReportService
{
    private readonly IJobOrderReportRepository _repo;

    public JobOrderReportService(IJobOrderReportRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<JobOrderReportResponseDto>> GetByQuotationItemAsync(int quotationId)
    {
        var entities = await _repo.GetByQuotationItemIdAsync(quotationId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override JobOrderReport MapToEntity(CreateJobOrderReportDto dto) => new()
    {
        ActionsTaken = dto.ActionsTaken,
        Findings = dto.Findings,
        QuotationItemId = dto.QuotationItemId,
        Recommendation = dto.Recommendation    
    };

    protected override JobOrderReportResponseDto MapToResponse(JobOrderReport entity) => new()
    {
        Id = entity.Id,
        ActionsTaken = entity.ActionsTaken,
        Findings = entity.Findings,
        QuotationItemId = entity.QuotationItemId,
        Recommendation = entity.Recommendation,
        CreatedAt = entity.CreatedAt
    };
}
