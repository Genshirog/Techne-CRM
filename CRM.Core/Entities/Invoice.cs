namespace CRM.Core.Entities;

public class Invoice
{
    public int Id {get;set;}
    public int? ServiceAgreementId {get;set;}
    public int? PromoCodeId {get;set;}
    public decimal DiagnosisFee {get;set;}
    public decimal EstimatedTotal {get;set;}
    public decimal FinalTotal {get;set;}
    public decimal DownpaymentAmount {get;set;}
    public decimal BalanceDue {get;set;}
    public decimal DiscountAmount {get;set;}
    public DateTime DueDate {get;set;}
    public InvoiceStatus Status {get;set;} = InvoiceStatus.Unpaid;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public ServiceAgreement? ServiceAgreement {get;set;} = null!;
    public PromoCode? PromoCode {get;set;}
    public ICollection<Payment> Payments {get;set;} = [];

}

public enum InvoiceStatus
{
    Unpaid,
    DiagnosisPaid,
    DownpaymentPaid,
    FullyPaid,
    Overdue
}
