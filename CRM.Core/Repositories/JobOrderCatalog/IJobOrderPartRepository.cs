using CRM.Core.Entities;

namespace CRM.Core.Repositories.JobOrderCatalog;

public interface IJobOrderPartRepository : IChildRepository<JobOrderPart, int>
{
    Task<decimal> GetTotalPartsAmountAsync(int jobOrderId);
}
