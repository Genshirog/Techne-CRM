namespace CRM.Core.Entities;

public class Campaign
{
    public int Id {get;set;}
    public int CreatedBy {get;set;}
    public string Title {get;set;} = string.Empty;
    public string Message {get;set;} = string.Empty;
    public CampaignChannel Channel {get;set;}
    public CampaignStatus Status {get;set;} = CampaignStatus.Draft;
    public DateTime? ScheduledAt {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public User CreatedByUser {get;set;} = null!;
    public ICollection<CampaignTarget> Targets {get;set;} = [];
    public ICollection<PromoCode> PromoCodes {get;set;} = [];
}

public enum CampaignChannel
{
    Email,
    SMS,
    InApp
}

public enum CampaignStatus
{
    Draft,
    Scheduled,
    Sent
}
