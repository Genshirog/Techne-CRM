namespace CRM.Core.Entities;

public class CampaignTarget
{
    public int Id {get;set;}
    public int CampaignId {get;set;}
    public int CustomerId {get;set;}
    public bool IsSent {get;set;} = false;
    public DateTime? SentAt {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

    public Campaign Campaign {get;set;} = null!;
    public Customer Customer {get;set;} = null!;
}
