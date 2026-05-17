namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseDiagnosisCatalogDto
{
    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;
}

public class CreateDiagnosisCatalogeDto : BaseDiagnosisCatalogDto {}
public class UpdateDiagnosisCatalogDto : BaseDiagnosisCatalogDto
{
    public int Id {get;set;}
}

public class DiagnosisCatalogResponseDto : BaseDiagnosisCatalogDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
