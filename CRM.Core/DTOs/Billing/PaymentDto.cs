using CRM.Core.Entities;

namespace CRM.Core.DTOs.Billing;

public class BasePaymentDto
{
    public int InvoiceId {get;set;}
    public int ReceivedBy {get;set;}
    public PaymentStage Stage {get;set;}
    public decimal Amount {get;set;}
    public PaymentMethod Method {get;set;}
    public string? ReferenceNumber {get;set;}
    public string? ProofPath {get;set;}
    public DateTime PaidAt {get;set;}
}

public class CreatePaymentDto : BasePaymentDto {}
public class UpdatePaymentDto : BasePaymentDto {}

public class PaymentResponseDto : BasePaymentDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public RefundResponseDto? Refund {get;set;}
}
