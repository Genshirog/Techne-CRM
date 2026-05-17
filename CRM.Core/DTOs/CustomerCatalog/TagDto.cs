namespace CRM.Core.DTOs.CustomerCatalog;

public class BaseTagDto
{
    public string Name {get;set;} = string.Empty;
    public string Color {get;set;} = string.Empty;
}

public class CreateTagDto : BaseTagDto {}
public class UpdateTagDto : BaseTagDto
{
    public int Id {get;set;}
}

public class TagResponseDto : BaseTagDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}


