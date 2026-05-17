using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class CampaignService : GeneralService<Campaign, CampaignResponseDto, CreateCampaignDto, UpdateCampaignDto>, ICampaignService
{
    private readonly ICampaignRepository _repo;

    public CampaignService(ICampaignRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<CampaignResponseDto>> GetByChannelAsync(CampaignChannel channel)
    {
        var entities = await _repo.GetByChannelAsync(channel) ?? throw new Exception($"Campaign {channel} Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<CampaignResponseDto>> GetByStatusAsync(CampaignStatus status)
    {
        var entities = await _repo.GetByStatusAsync(status) ?? throw new Exception($"Campaign {status} Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<CampaignResponseDto?> GetWithPromoCodesAsync(int id)
    {
        var entity = await _repo.GetWithPromoCodesAsync(id) ?? throw new Exception($"Promo Code {id} Not Found");
        return MapToResponse(entity);
    }

    public async Task<CampaignResponseDto?> GetWithTargetAsync(int id)
    {
        var entity = await _repo.GetWithTargetsAsync(id) ?? throw new Exception($"Promo Code {id} Not Found");
        return MapToResponse(entity);    
    }

    public override Campaign MapToEntity(CreateCampaignDto request) => new()
    {
        Channel = request.Channel,
        CreatedBy = request.CreatedBy,
        Message = request.Message,
        ScheduledAt = request.ScheduledAt,
        Targets = request.Targets.Select(t => new CampaignTarget{CustomerId = t.CustomerId}).ToList(),
        Title = request.Title,
    };

    public override CampaignResponseDto MapToResponse(Campaign entity) => new()
    {
        Id = entity.Id,
        Channel = entity.Channel,
        CreatedBy = entity.CreatedBy,
        Message = entity.Message,
        ScheduledAt = entity.ScheduledAt,
        Targets = entity.Targets?.Select(t => new CampaignTargetResponseDto
        {
            Id = t.Id,
            CustomerId = t.CustomerId,
            CampaignId = t.CampaignId,
            IsSent = t.IsSent,
            SentAt = t.SentAt,
            CreatedAt = t.CreatedAt
        }).ToList() ?? [],
        Title = entity.Title,
    };

    public override async Task<CampaignResponseDto> UpdateAsync(UpdateCampaignDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.Title = request.Title;
        entity.Message = request.Message;
        entity.Channel = request.Channel;
        entity.ScheduledAt = request.ScheduledAt;
        entity.Status = request.Status ?? entity.Status;
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
