using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.JobOrderCatalog;

public interface IJobOrderPartService: IChildService<JobOrderPart, JobOrderPartResponseDto, CreateJobOrderPartDto>
{
    Task<decimal> GetTotalPartsAmountAsync(int jobOrderId);
}
