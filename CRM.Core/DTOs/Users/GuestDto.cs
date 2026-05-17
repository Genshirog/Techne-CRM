namespace CRM.Core.DTOs.Users;

public class BaseGuestDto
{
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
}

public class CreateGuestDto : BaseGuestDto {}
public class UpdateGuestDto : BaseGuestDto
{
    public int Id {get;set;}
}

public class GuestResponseDto : BaseGuestDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}