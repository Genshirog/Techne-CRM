namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseMessageDto
{
    public int ConversationId {get;set;}
    public int SenderId {get;set;}
    public string Body {get;set;} = string.Empty;
    public string? AttachmentPath {get;set;}
    public string? AttachmentName {get;set;}
}

public class CreateMessageDto : BaseMessageDto{}
public class UpdateMessageDto : BaseMessageDto
{
    public bool IsRead {get;set;}
}

public class MessageResponseDto : BaseMessageDto
{
    public int Id {get;set;}
    public bool IsRead {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}