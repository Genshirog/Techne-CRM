namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseCampaignTargetDto
{
    public int CustomerId {get;set;}
}

public class CreateCampaignTargetDto : BaseCampaignTargetDto{}
public class UpdateCampaignTargetDto : BaseCampaignTargetDto{}

public class CampaignTargetResponseDto : BaseCampaignTargetDto
{
    public int Id {get;set;}
    public int CampaignId {get;set;}
    public bool IsSent {get;set;}
    public DateTime? SentAt {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}