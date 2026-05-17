using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface ICampaignRepository : IRepository<Campaign>
{
    Task <IEnumerable<Campaign>> GetByStatusAsync(CampaignStatus status);
    Task <IEnumerable<Campaign>> GetByChannelAsync(CampaignChannel channel);
    Task <Campaign?> GetWithTargetsAsync(int id);
    Task <Campaign?> GetWithPromoCodesAsync(int id);
}
