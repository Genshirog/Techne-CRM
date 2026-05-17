using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class CampaignRepository : Repository<Campaign>, ICampaignRepository
{
    public CampaignRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Campaign>> GetByChannelAsync(CampaignChannel channel)
    {
        return await _dbSet.Include(c => c.Channel).ToListAsync();
    }

    public async Task<IEnumerable<Campaign>> GetByStatusAsync(CampaignStatus status)
    {
        return await _dbSet.Include(c => c.Status).ToListAsync();
    }

    public async Task<Campaign?> GetWithPromoCodesAsync(int id)
    {
        return await _dbSet.Include(c => c.PromoCodes).FirstOrDefaultAsync(c => c.Id == id);
    }

    public Task<Campaign?> GetWithTargetsAsync(int id)
    {
        throw new NotImplementedException();
    }
}
