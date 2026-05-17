using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface ICampaignTargetService : IChildService<CampaignTarget, CampaignTargetResponseDto, CreateCampaignTargetDto>
{
    Task<IEnumerable<CampaignTargetResponseDto>> GetUnsentAsync(int campaignId);
    Task<IEnumerable<CampaignTargetResponseDto>> GetByCustomerIdAsync(int customerId);
}
