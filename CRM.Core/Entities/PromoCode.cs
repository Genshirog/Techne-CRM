namespace CRM.Core.Entities;

public class PromoCode
{
    public int Id {get;set;}
    public int? CampaignId {get;set;}
    public string Code {get;set;} = string.Empty;
    public DiscountType DiscountType {get;set;}
    public decimal DiscountValue {get;set;}
    public DateTime ValidFrom {get;set;}
    public DateTime ValidUntil {get;set;}
    public int MaxUses {get;set;}
    public int UsedCount {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Campaign? Campaign {get;set;}
}

public enum DiscountType
{
    Fixed,
    Percentage
}
