using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;

namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseCampaignDto
{
    public int CreatedBy {get;set;}
    public string Title {get;set;} = string.Empty;
    public string Message {get;set;} = string.Empty;
    public CampaignChannel Channel {get;set;}
    public DateTime? ScheduledAt {get;set;}
}

public class CreateCampaignDto : BaseCampaignDto
{
    public List<CreateCampaignTargetDto> Targets {get;set;} = [];
}

public class UpdateCampaignDto : BaseCampaignDto
{
    public int Id;
    public CampaignStatus? Status {get;set;}
    public List<UpdateCampaignTargetDto> Targets {get;set;} = [];
}

public class CampaignResponseDto : BaseCampaignDto
{
    public int Id {get;set;}
    public CampaignStatus Status {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<CampaignTargetResponseDto> Targets {get;set;} = [];
    public List<PromoCodeResponseDto> PromoCodes {get;set;} = [];
}
