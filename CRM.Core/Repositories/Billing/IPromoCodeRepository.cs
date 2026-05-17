using CRM.Core.Entities;

namespace CRM.Core.Repositories.Billing;

public interface IPromoCodeRepository : IRepository<PromoCode>
{
    Task<PromoCode?> GetByCodeAsync(string code);
    Task<IEnumerable<PromoCode>> GetByCampaignIdAsync(int campaignId);
    Task<IEnumerable<PromoCode>> GetActiveAsync();
}
