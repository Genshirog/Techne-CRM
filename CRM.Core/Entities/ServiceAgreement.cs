namespace CRM.Core.Entities;

public class ServiceAgreement
{
    public int Id {get;set;}
    public int JobOrderId {get;set;}
    public int QuotationId {get;set;}
    public decimal FinalLabor {get;set;}
    public decimal FinalParts {get;set;}
    public decimal FinalTotal {get;set;}
    public DateTime? WarrantyStart {get;set;}
    public DateTime? WarrantyEnd {get;set;}
    public ServiceAgreementStatus Status {get;set;} = ServiceAgreementStatus.Draft;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public JobOrder JobOrder {get;set;} = null!;
    public Quotation Quotation {get;set;} = null!;
    public ServiceAgreementSignature? Signature {get;set;}
}

public enum ServiceAgreementStatus
{
    Draft,
    Issued,
    Signed
}