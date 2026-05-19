namespace CRM.Core.DTOs.Users;

public class BaseTechniciansDto
{
    public int UserId {get;set;}
    public string Specialization {get;set;} = string.Empty;
}

public class CreateTechnicianDto : BaseTechniciansDto {}
public class UpdateTechnicianDto : BaseTechniciansDto
{
    public int Id {get;set;}
}

public class UpdateTechnicianAvailabilityDto
{
    public int Id {get;set;}
    public bool IsAvailable {get;set;}
}

public class TechnicianResponseDto : BaseTechniciansDto
{
    public int Id {get;set;}
    public bool IsAvailable {get;set;}
    public double AverageRating {get;set;}
    public int TotalReviews {get;set;}
    public DateTime CreatedAt {get;set;}
    public UserResponseDto? User {get;set;}
}
