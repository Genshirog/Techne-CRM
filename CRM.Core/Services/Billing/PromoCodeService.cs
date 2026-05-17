using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;

namespace CRM.Core.Services.Billing;

public class PromoCodeService : GeneralService<PromoCode, PromoCodeResponseDto, CreatePromoCodeDto, UpdatedPromoCodeDto>, IPromoCodeService
{
    private readonly IPromoCodeRepository _repo;

    public PromoCodeService(IPromoCodeRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PromoCodeResponseDto>> GetActiveAsync()
    {
        var entities = await _repo.GetActiveAsync();
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<PromoCodeResponseDto>> GetByCampaignIdAsync(int campaignId)
    {
        var entities = await _repo.GetByCampaignIdAsync(campaignId);
        return entities.Select(MapToResponse);
    }

    public async Task<PromoCodeResponseDto?> GetByCodeAsync(string code)
    {
        var entity = await _repo.GetByCodeAsync(code) ?? throw new Exception($"Code {code} is not found");
        return MapToResponse(entity);
    }

    public override PromoCode MapToEntity(CreatePromoCodeDto request) => new()
    {
        CampaignId = request.CampaignId,
        Code = request.Code,
        DiscountType = request.DiscountType,
        DiscountValue = request.DiscountValue,
        MaxUses = request.MaxUses,
        ValidUntil = request.ValidUntil,
        ValidFrom = request.ValidFrom,
    };

    public override PromoCodeResponseDto MapToResponse(PromoCode entity) => new()
    {
        Id = entity.Id,
        CampaignId = entity.CampaignId,
        Code = entity.Code,
        DiscountType = entity.DiscountType,
        DiscountValue = entity.DiscountValue,
        MaxUses = entity.MaxUses,
        ValidUntil = entity.ValidUntil,
        ValidFrom = entity.ValidFrom,
        CreatedAt = entity.CreatedAt,
        UpdatedAt =entity.UpdatedAt,
    };

    public override async Task<PromoCodeResponseDto> UpdateAsync(UpdatedPromoCodeDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Code {request.Id} not Found");
        
        entity.CampaignId = request.CampaignId;
        entity.Code = request.Code;
        entity.DiscountType = request.DiscountType;
        entity.DiscountValue = request.DiscountValue;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.MaxUses = request.MaxUses;
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
