using CRM.Core.Entities;

namespace CRM.Core.DTOs.Users;

public class BaseUserDto
{
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string Address {get;set;} = string.Empty;
    public string PhoneNumber {get;set;} = string.Empty;
    public DateTime DateOfBirth {get;set;}
}

public class CreateUserDto : BaseUserDto
{
    public string Password {get;set;} = string.Empty;
    public UserRole Role {get;set;} = UserRole.Customer;
    public int AccessLevel {get;set;} = 0;
}

public class UpdateUserDto : BaseUserDto
{
    public int Id {get;set;}
}

public class UpdateUserRoleDto
{
    public int Id {get;set;}
    public UserRole Role {get;set;}
    public int AccessLevel {get;set;}
}

public class ChangePasswordDto
{
    public int Id {get;set;}
    public string CurrentPassword {get;set;} = string.Empty;
    public string NewPassword {get;set;} = string.Empty;
}

public class UserResponseDto : BaseUserDto
{
    public int Id {get;set;}
    public UserRole Role {get;set;}
    public int AccessLevel {get;set;}
    public DateTime CreatedAt {get;set;}
}

public class AuthResponseDto
{
    public int Id {get;set;}
    public string Token {get;set;} = string.Empty;
    public string Name {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public UserRole Role {get;set;}
}

public class LoginRequestDto
{
    public string Email {get;set;} = string.Empty;
    public string Password {get;set;} = string.Empty;
}
