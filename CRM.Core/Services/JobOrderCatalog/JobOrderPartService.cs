using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.JobOrderCatalog;

namespace CRM.Core.Services.JobOrderCatalog;

public class JobOrderPartService: ChildService<JobOrderPart, JobOrderPartResponseDto, CreateJobOrderPartDto>, IJobOrderPartService
{
    private readonly IJobOrderPartRepository _repo;

    public JobOrderPartService(IJobOrderPartRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<decimal> GetTotalPartsAmountAsync(int jobOrderId)
    {
        return await _repo.GetTotalPartsAmountAsync(jobOrderId);
    }

    protected override JobOrderPart MapToEntity(CreateJobOrderPartDto dto) => new()
    {
        PartName = dto.PartName,
        Quantity = dto.Quantity,
        UnitPrice = dto.UnitPrice,
    };

    protected override JobOrderPartResponseDto MapToResponse(JobOrderPart entity) => new()
    {
        Id = entity.Id,
        PartName = entity.PartName,
        Quantity = entity.Quantity,
        UnitPrice = entity.UnitPrice,
        CreatedAt = entity.CreatedAt,
    };
}
