namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseNotificationDto
{
    public int UserId {get;set;}
    public string Title {get;set;} = string.Empty;
    public string Body {get;set;} = string.Empty;
    public string? Link {get;set;}
}

public class CreateNotificationDto : BaseNotificationDto{}
public class UpdateNotificationDto : BaseNotificationDto
{
    public int Id {get;set;}
    public bool IsRead {get;set;}
}

public class NotificationResponseDto : BaseNotificationDto
{
    public int Id {get;set;}
    public bool IsRead {get;set;}
    public DateTime CreatedAt {get;set;}
}
