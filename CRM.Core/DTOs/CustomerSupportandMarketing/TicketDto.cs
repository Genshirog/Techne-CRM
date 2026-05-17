using CRM.Core.Entities;

namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseTicketDto
{
    public int CustomerId {get;set;}
    public int? JobOrderId {get;set;}
    public int? AssignedTo {get;set;}
    public string Title {get;set;} = string.Empty;
    public TicketCategory Category {get;set;}
    public TicketPriority Priority {get;set;}
}

public class CreateTicketDto : BaseTicketDto
{
    public List<CreateTicketReplyDto> Replies {get;set;} = [];
}

public class UpdateTicketDto : BaseTicketDto
{
    public int Id {get;set;}
    public TicketStatus? Status {get;set;}
    public List<UpdateTicketReplyDto> Replies {get;set;} = [];
}

public class TicketResponseDto : BaseTicketDto
{
    public int Id {get;set;}
    public TicketStatus Status {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<TicketReplyResponseDto> Replies {get;set;} = [];
}
