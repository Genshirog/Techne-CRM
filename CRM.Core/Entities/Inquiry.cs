namespace CRM.Core.Entities;

public class Inquiry
{
    public int Id {get;set;}
    public int? CustomerId {get;set;}
    public int? GuestId {get;set;}
    public int? CompanyId {get;set;}
    public InquiryStatus Status {get;set;} = InquiryStatus.Pending;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}
    public Guest Guest {get;set;} = null!;
    public Customer Customer {get;set;} = null!;
    public Company Company {get;set;} = null!;
    public ICollection<InquiryItem> InquiryItems {get;set;} = [];
}

public enum InquiryStatus
{
    Pending,
    Acknowledged,
    InProgress,
    Completed,
    Cancelled
}