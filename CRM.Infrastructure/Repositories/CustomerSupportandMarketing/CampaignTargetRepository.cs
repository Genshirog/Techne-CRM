using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class CampaignTargetRepository : ChildRepository<CampaignTarget, int>, ICampaignTargetRepository
{
    public CampaignTargetRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<CampaignTarget>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public override async Task<IEnumerable<CampaignTarget>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(c => c.CampaignId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<CampaignTarget>> GetUnsentAsync(int campaignId)
    {
        return await _dbSet.Where(c => c.CampaignId == campaignId && c.IsSent == false).ToListAsync();
    }
}
