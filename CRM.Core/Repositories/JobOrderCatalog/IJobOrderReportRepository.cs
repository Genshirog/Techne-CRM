using CRM.Core.Entities;

namespace CRM.Core.Repositories.JobOrderCatalog;

public interface IJobOrderReportRepository : IChildRepository<JobOrderReport, int>
{
    Task<IEnumerable<JobOrderReport>> GetByQuotationItemIdAsync(int quotationItemId);
}
