namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseTicketRepliesDto
{
    public int TicketId {get;set;}
    public int SenderId {get;set;}
    public string Body {get;set;} = string.Empty;
    public string? Attachment {get;set;}
}

public class CreateTicketReplyDto : BaseTicketRepliesDto{}
public class UpdateTicketReplyDto : BaseTicketRepliesDto{}

public class TicketReplyResponseDto : BaseTicketRepliesDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}