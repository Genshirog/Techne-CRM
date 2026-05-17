using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class FeedbackRepository: Repository<Feedback>, IFeedbackRepository
{
    public FeedbackRepository(AppDbContext context) : base(context){}

    public async Task<double> GetAverageRatingAsync()
    {
        return await _dbSet.AverageAsync(f => f.OverallRating);
    }

    public async Task<double> GetAverageTechnicianRatingAsync(int technicianId)
    {
        return await _dbSet.Where(f => f.JobOrder.TechnicianId == technicianId).AverageAsync(f => f.TechnicianRating);
    }

    public async Task<IEnumerable<Feedback>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public async Task<Feedback?> GetByJobOrderIdAsync(int jobOrderId)
    {
        return await _dbSet.Where(f => f.JobOrderId == jobOrderId).FirstOrDefaultAsync();
    }
}
