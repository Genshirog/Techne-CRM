namespace CRM.Core.Entities;

public class JobOrder
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
    public int? TechnicianId {get;set;}
    public int? AssignedBy {get;set;}
    public DateTime? AssignedAt {get;set;}
    public DateTime? StartDate {get;set;}
    public DateTime? ExpectedFinishedDate {get;set;}
    public DateTime? CompletedAt {get;set;}
    public string? TechnicianNotes {get;set;}
    public JobOrderStatus Status {get;set;} = JobOrderStatus.Unassigned;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Quotation Quotation {get;set;} = null!;
    public Technician? Technician {get;set;}
    public User? AssignedByUser {get;set;}

    public ICollection<JobOrderPart> Parts {get;set;} = [];
    public ICollection<JobOrderReport> Reports {get;set;} = [];
       
}

public enum JobOrderStatus
{
    Unassigned,
    Scheduled,
    InProgress,
    PendingReview,
    Completed,
    Cancelled
}
