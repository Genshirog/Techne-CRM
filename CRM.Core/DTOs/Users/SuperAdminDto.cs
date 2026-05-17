namespace CRM.Core.DTOs.Users;

public class BaseSuperAdminDto
{
    public int UserId {get;set;}
    public string Department {get;set;} = string.Empty;
}

public class CreateSuperAdminDto : BaseSuperAdminDto {}
public class UpdateSuperAdminDto : BaseSuperAdminDto
{
    public int Id {get;set;}
}

public class SuperAdminResponseDto : BaseSuperAdminDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public int AccessLevel {get;set;}
}
