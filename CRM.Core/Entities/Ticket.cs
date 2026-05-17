namespace CRM.Core.Entities;

public class Ticket
{
    public int Id {get;set;}
    public int CustomerId {get;set;}
    public int? JobOrderId {get;set;}
    public int? AssignedTo {get;set;}
    public string Title {get;set;} = string.Empty;
    public TicketCategory Category {get;set;}
    public TicketPriority Priority {get;set;}
    public TicketStatus Status {get;set;} = TicketStatus.Open;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Customer Customer {get;set;} = null!;
    public JobOrder JobOrder {get;set;} = null!;
    public Technician AssignedToUser {get;set;} = null!;
    public ICollection<TicketReply> Replies {get;set;} = [];
}

public enum TicketCategory
{
    Billing,
    Technical,
    Warranty,
    Complaint,
    Other
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Urgent
}

public enum TicketStatus
{
    Open,
    InProgress,
    Resolved,
    Closed
}
