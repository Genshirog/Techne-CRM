using CRM.Core.DTOs.Users;

namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseInquiryTechnicalDetailDto
{
    public int InquiryItemId {get;set;}
    public int? TechnicianId {get;set;}
    public int? CustomerDeviceId {get;set;}
}

public class CreateInquiryTechnicalDetailDto : BaseInquiryTechnicalDetailDto
{
    public List<CreateInquiryDiagnosisDto> Diagnoses {get;set;} = [];
}

public class UpdateInquiryTechnicalDetailDto : BaseInquiryTechnicalDetailDto
{
    public List<UpdateInquiryDiagnosisDto> Diagnoses {get;set;} = [];
}

public class InquiryTechnicalDetailResponseDto : BaseInquiryTechnicalDetailDto
{
    public int Id {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public TechnicianResponseDto? Technician {get;set;}
    public List<InquiryDiagnosisResponseDto> Diagnoses {get;set;} = [];
}

public class AssignTechnicianDto
{
    public int TechnicianId { get; set; }
}