namespace CRM.Core.DTOs.Users;

public class BaseCompanyDto
{
    public string Name {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
}

public class CreateCompanyDto : BaseCompanyDto {}
public class UpdateCompanyDto : BaseCompanyDto
{
    public int Id {get;set;}
    public string LogoUrl {get;set;} = string.Empty;
}

public class CompanyResponseDto : BaseCompanyDto
{
    public int Id {get;set;}
    public string LogoUrl {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;}
}