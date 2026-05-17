namespace CRM.Core.Entities;

public class Message
{
    public int Id {get;set;}
    public int ConversationId {get;set;}
    public int SenderId {get;set;}
    public string Body {get;set;} = string.Empty;
    public string? AttachmentPath {get;set;}
    public string? AttachmentName {get;set;}
    public bool IsRead {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Conversation Conversation {get;set;} = null!;
    public User Sender {get;set;} = null!;
}
