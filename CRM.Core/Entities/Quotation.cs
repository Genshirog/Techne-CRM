namespace CRM.Core.Entities;

public class Quotation
{
    public int Id {get;set;}
    public int InquiryId {get;set;}
    public int? CustomerId {get;set;}
    public int? CompanyId {get;set;}
    public int TechnicianId {get;set;}
    public int ApprovedBy {get;set;}
    public decimal LaborEstimate {get;set;}
    public decimal PartsEstimate {get;set;}
    public decimal DiagnosisFee {get;set;}
    public decimal GrandTotal {get;set;}
    public QuotationStatus Status {get;set;} = QuotationStatus.Draft;
    public Inquiry Inquiry {get;set;} = null!;
    public Customer? Customer {get;set;}
    public Company? Company {get;set;}
    public Technician Technician {get;set;} = null!;
    public User ApprovedByUser {get;set;} = null!;
    public QuotationClientSnapshot? QuotationClientSnapshot {get;set;}
    public ICollection<QuotationItem> QuotationItems {get;set;} = [];
    public QuotationSignature? Signature {get;set;}
}

public enum QuotationStatus
{
    Draft,
    Pending,
    Approved,
    Rejected,
    Cancelled
}
