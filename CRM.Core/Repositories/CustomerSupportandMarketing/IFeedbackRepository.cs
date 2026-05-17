using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface IFeedbackRepository : IRepository<Feedback>
{
    Task<Feedback?> GetByJobOrderIdAsync(int jobOrderId);
    Task<IEnumerable<Feedback>> GetByCustomerIdAsync(int customerId);
    Task<double> GetAverageRatingAsync();
    Task<double> GetAverageTechnicianRatingAsync(int technicianId);
}
