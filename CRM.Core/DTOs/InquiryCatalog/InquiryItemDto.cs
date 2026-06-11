using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.Entities;

namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseInquiryItemDto
{
    public int ServiceCategoryId {get;set;}
    public DateOnly? PreferredDate {get;set;}
    public TimeOnly? PreferredTime {get;set;}
    public string IssueDescription {get;set;} = string.Empty;
    public string? Notes {get;set;}
    public Urgency Urgency {get;set;}
}

public class CreateInquiryItemDto : BaseInquiryItemDto
{
}

public class UpdateInquiryItemDto : BaseInquiryItemDto
{
    public List<UpdateInquiryTechnicalDetailDto> InquiryTechnicalDetails {get;set;} = [];
}

public class InquiryItemResponseDto : BaseInquiryItemDto
{
    public int Id {get;set;}
    public int InquiryId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public ServiceCategoryResponseDto? ServiceCategory {get;set;}
    public List<InquiryTechnicalDetailResponseDto> InquiryTechnicalDetails {get;set;} = [];
}