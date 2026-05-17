namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseConversationDto
{
    public int? InquiryId {get;set;}
    public int? JobOrderId {get;set;}
}

public class CreateConversationDto : BaseConversationDto{}
public class UpdateConversationDto : BaseConversationDto
{
    public int Id;
}

public class ConversationResponseDto : BaseConversationDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<MessageResponseDto> Messages {get;set;} = [];
}
