using CRM.Core.Entities;

namespace CRM.Core.Repositories.JobOrderCatalog;

public interface IJobOrderRepository : IRepository<JobOrder>
{
    Task<IEnumerable<JobOrder>> GetByStatusAsync(JobOrderStatus status);
    Task<IEnumerable<JobOrder>> GetByTechnicianIdAsync(int technicianId);
    Task<JobOrder?> GetByQuotationIdAsync(int quotationId);
    Task<JobOrder?> GetWithPartsAsync(int id);
    Task<JobOrder?> GetWithReportsAsync(int id);
}
