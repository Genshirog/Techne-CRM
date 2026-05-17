using CRM.Core.Entities;

namespace CRM.Core.DTOs.Billing;

public class BaseInvoiceDto
{
    public int ServiceAgreementId {get;set;}
    public int? PromoCodeId {get;set;}
    public decimal DiagnosisFee {get;set;}
    public decimal EstimatedTotal {get;set;}
    public decimal FinalTotal {get;set;}
    public decimal DownpaymentAmount {get;set;}
    public decimal BalanceDue {get;set;}
    public decimal DiscountAmount {get;set;}
    public DateTime DueDate {get;set;}
}

public class CreateInvoiceDto : BaseInvoiceDto{}
public class UpdateInvoiceDto : BaseInvoiceDto
{
    public int Id;
    public InvoiceStatus? Status {get;set;}
}

public class InvoiceResponseDto : BaseInvoiceDto
{
    public int Id {get;set;}
    public InvoiceStatus Status {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<PaymentResponseDto> Payments {get;set;} = [];
}
