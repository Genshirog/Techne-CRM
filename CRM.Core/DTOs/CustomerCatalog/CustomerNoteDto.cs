namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseCustomerNoteDto
{
    public int CustomerId {get;set;}
    public string Note {get;set;} = string.Empty;
}

public class CreateCustomerNoteDto : BaseCustomerNoteDto{}

public class UpdateCustomerNoteDto : BaseCustomerNoteDto
{
    public int Id {get;set;}
}

public class CustomerNoteResponseDto : BaseCustomerNoteDto
{
    public int Id {get;set;}
    public int CreatedBy {get;set;}
    public string CreatedByName {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;}
}
