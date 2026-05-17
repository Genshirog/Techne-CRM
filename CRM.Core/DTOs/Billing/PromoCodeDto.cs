using CRM.Core.Entities;

namespace CRM.Core.DTOs.Billing;

public class BasePromoCodeDto
{
    public int? CampaignId {get;set;}
    public string Code {get;set;} = string.Empty;
    public DiscountType DiscountType {get;set;}
    public decimal DiscountValue {get;set;}
    public DateTime ValidFrom {get;set;}
    public DateTime ValidUntil {get;set;}
    public int MaxUses {get;set;}
}

public class CreatePromoCodeDto : BasePromoCodeDto{}
public class UpdatedPromoCodeDto : BasePromoCodeDto
{
    public int Id {get;set;} 
}

public class PromoCodeResponseDto : BasePromoCodeDto
{
    public int Id {get;set;}
    public int UsedCount {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
