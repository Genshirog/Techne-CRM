using CRM.Core.DTOs.Billing;

namespace CRM.Core.Services.Billing;

public interface IPromoCodeService : IGeneralService<PromoCodeResponseDto, CreatePromoCodeDto, UpdatedPromoCodeDto>
{
    Task<PromoCodeResponseDto?> GetByCodeAsync(string code);
    Task<IEnumerable<PromoCodeResponseDto>> GetByCampaignIdAsync(int campaignId);
    Task<IEnumerable<PromoCodeResponseDto>> GetActiveAsync();
}
