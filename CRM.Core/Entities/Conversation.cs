namespace CRM.Core.Entities;

public class Conversation
{
    public int Id {get;set;}
    public int? InquiryId {get;set;}
    public int? JobOrderId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Inquiry Inquiry {get;set;} = null!;
    public JobOrder JobOrder {get;set;} = null!;
    public ICollection<Message> Messages {get;set;} = [];
}
