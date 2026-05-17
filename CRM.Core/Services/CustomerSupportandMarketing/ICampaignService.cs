using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface ICampaignService : IGeneralService<CampaignResponseDto, CreateCampaignDto, UpdateCampaignDto>
{
    Task<IEnumerable<CampaignResponseDto>> GetByStatusAsync(CampaignStatus status);
    Task<IEnumerable<CampaignResponseDto>> GetByChannelAsync(CampaignChannel channel);
    Task<CampaignResponseDto?> GetWithTargetAsync(int id);
    Task<CampaignResponseDto?> GetWithPromoCodesAsync(int id);
}
