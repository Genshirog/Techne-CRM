namespace CRM.Core.DTOs.CustomerSupportandMarketing;

public class BaseFeedbackDto
{
    public int JobOrderId {get;set;}
    public int CustomerId {get;set;}
    public int OverallRating {get;set;}
    public string? Review {get;set;}
    public int ServiceRating {get;set;}
    public string? ServiceComment {get;set;}
    public int TechnicianRating {get;set;}
    public string? TechnicianComment {get;set;}
}

public class CreateFeedbackDto : BaseFeedbackDto{}
public class UpdateFeedbackDto : BaseFeedbackDto
{
    public int Id {get;set;}
}

public class FeedbackResponseDto : BaseFeedbackDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}
