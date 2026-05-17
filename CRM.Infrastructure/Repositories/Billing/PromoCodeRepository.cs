using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.Billing;

public class PromoCodeRepository : Repository<PromoCode>, IPromoCodeRepository
{
    public PromoCodeRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<PromoCode>> GetActiveAsync()
    {
        var now = DateTime.UtcNow;
        return await _dbSet.Where(p => p.ValidFrom <= now && p.ValidUntil >= now && p.UsedCount < p.MaxUses).ToListAsync();
    }

    public async Task<IEnumerable<PromoCode>> GetByCampaignIdAsync(int campaignId)
    {
       return await _dbSet.Where(p => p.CampaignId == campaignId).ToListAsync();
    }

    public async Task<PromoCode?> GetByCodeAsync(string code)
    {
        return await _dbSet.FirstOrDefaultAsync(p => p.Code == code);
    }
}
