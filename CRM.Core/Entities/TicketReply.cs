namespace CRM.Core.Entities;

public class TicketReply
{
    public int Id {get;set;}
    public int TicketId {get;set;}
    public int SenderId {get;set;}
    public string Body {get;set;} = string.Empty;
    public string? Attachment {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Ticket Ticket {get;set;} = null!;
    public User Sender {get;set;} = null!;
}
