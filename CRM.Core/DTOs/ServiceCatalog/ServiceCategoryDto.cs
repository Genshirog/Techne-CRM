namespace CRM.Core.DTOs.ServiceCatalog;

public class BaseServiceCategoryDto
{
    public string Name {get;set;} = string.Empty;
    public string Type {get;set;} = string.Empty;    
}
public class CreateServiceCategoryDto : BaseServiceCategoryDto {}

public class UpdateServiceCategoryDto : BaseServiceCategoryDto
{
    public int Id {get;set;}
}
public class ServiceCategoryResponseDto : BaseServiceCategoryDto
{
    public int Id {get;set;} 
    public DateTime CreatedAt {get;set;}   
}
