namespace CRM.Core.Entities;

public class Technician
{
    public int Id {get;set;}
    public int UserId {get;set;}
    public string Specialization {get;set;} = string.Empty;
    public bool IsAvailable {get;set;} = true;
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public User User {get;set;} = null!;
}
