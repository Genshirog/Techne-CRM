namespace CRM.Core.Entities;

public class InquiryDiagnosis
{
    public int Id {get;set;}
    public int InquiryTechnicalDetailId {get;set;}
    public int? DiagnosisCatalogId {get;set;}
    public string? CustomDiagnosis {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public InquiryTechnicalDetail InquiryTechnicalDetail {get;set;} = null!;
    public DiagnosisCatalog? DiagnosisCatalog {get;set;}
}
