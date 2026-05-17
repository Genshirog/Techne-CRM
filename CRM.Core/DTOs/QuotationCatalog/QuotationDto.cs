using CRM.Core.Entities;

namespace CRM.Core.DTOs.QuotationCatalog;

public class BaseQuotationDto
{
    public int InquiryId {get;set;}
    public int? CustomerId {get;set;}
    public int? CompanyId {get;set;}
    public int TechnicianId {get;set;}
    public int ApprovedBy {get;set;}
    public decimal LaborEstimate {get;set;}
    public decimal PartsEstimate {get;set;}
    public decimal DiagnosisFee {get;set;}
    public decimal GrandTotal {get;set;}
}

public class CreateQuotationDto : BaseQuotationDto
{
    public QuotationClientSnapshotDto? ClientSnapshot {get;set;}
    public List<CreateQuotationItemDto> QuotationItems {get;set;} = [];
}

public class UpdateQuotationDto : BaseQuotationDto
{
    public int Id {get;set;}
    public QuotationStatus? Status {get;set;}
    public QuotationClientSnapshotDto? ClientSnapshot {get;set;}
    public List<UpdateQuotationItemDto> QuotationItems {get;set;} =[];
}

public class QuotationResponseDto : BaseQuotationDto
{
    public int Id {get;set;}
    public QuotationStatus Status {get;set;}
    public QuotationClientSnapshotResponseDto? ClientSnapshot {get;set;}
    public QuotationSignatureResponseDto? Signature {get;set;}
    public List<QuotationItemResponseDto> QuotationItems {get;set;} = [];
}
