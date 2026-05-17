using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface ICampaignTargetRepository : IChildRepository<CampaignTarget, int>
{
    Task<IEnumerable<CampaignTarget>> GetUnsentAsync(int campaignId);
    Task<IEnumerable<CampaignTarget>> GetByCustomerIdAsync(int customerId);
}
