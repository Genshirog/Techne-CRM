using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class CampaignTargetService : ChildService<CampaignTarget, CampaignTargetResponseDto, CreateCampaignTargetDto>, ICampaignTargetService
{
    private readonly ICampaignTargetRepository _repo;

    public CampaignTargetService(ICampaignTargetRepository repo) : base(repo)
    {
        _repo = repo;   
    }

    public async Task<IEnumerable<CampaignTargetResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerIdAsync(customerId) ?? throw new Exception ($"Customer {customerId} Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<CampaignTargetResponseDto>> GetUnsentAsync(int campaignId)
    {
        var entities = await _repo.GetUnsentAsync(campaignId) ?? throw new Exception ($"Customer {campaignId} Not Found");
        return entities.Select(MapToResponse);
    }

    protected override CampaignTarget MapToEntity(CreateCampaignTargetDto dto) => new()
    {
        CustomerId = dto.CustomerId,
    };

    protected override CampaignTargetResponseDto MapToResponse(CampaignTarget entity) => new()
    {
        Id = entity.Id,
        CampaignId = entity.CampaignId,
        CustomerId = entity.CustomerId,
        IsSent = entity.IsSent,
        SentAt = entity.SentAt,
        CreatedAt = entity.CreatedAt
    };
}
