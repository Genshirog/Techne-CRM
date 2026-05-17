namespace CRM.Core.DTOs.Billing;

public class BaseRefundDto
{
    public int PaymentId {get;set;}
    public int RefundedBy {get;set;}
    public decimal Amount {get;set;}
    public string Reason {get;set;} = string.Empty;
}

public class CreateRefundDto : BaseRefundDto{}
public class UpdateRefundDto : BaseRefundDto {}
public class RefundResponseDto : BaseRefundDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
