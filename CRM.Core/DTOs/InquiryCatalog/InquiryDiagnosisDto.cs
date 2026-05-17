namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseInquiryDiagnosisDto
{
    public int InquiryTechnicalDetailId {get;set;}
    public int? DiagnosisCatalogId {get;set;}
    public string? CustomDiagnosis {get;set;}
}

public class CreateInquiryDiagnosisDto : BaseInquiryDiagnosisDto{}
public class UpdateInquiryDiagnosisDto : BaseInquiryDiagnosisDto
{
    public int Id {get;set;}
}

public class InquiryDiagnosisResponseDto : BaseInquiryDiagnosisDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
}
