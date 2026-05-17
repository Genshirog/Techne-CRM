namespace CRM.Core.Entities;

public class Feedback
{
    public int Id {get;set;}
    public int JobOrderId {get;set;}
    public int CustomerId {get;set;}
    public int OverallRating {get;set;}
    public string? Review {get;set;}
    public int ServiceRating {get;set;}
    public string? ServiceComment {get;set;}
    public int TechnicianRating {get;set;}
    public string? TechnicianComment {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public JobOrder JobOrder {get;set;} = null!;
    public Customer Customer {get;set;} = null!;
}
