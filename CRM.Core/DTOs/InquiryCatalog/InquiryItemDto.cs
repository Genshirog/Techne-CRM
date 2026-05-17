using CRM.Core.Entities;

namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseInquiryItemDto
{
    public int ServiceCategoryId {get;set;}
    public DateOnly? PreferredDate {get;set;}
    public TimeOnly? PreferredTime {get;set;}
}

public class CreateInquiryItemDto : BaseInquiryItemDto
{
    public List<CreateInquiryTechnicalDetailDto> InquiryTechnicalDetails {get;set;} = [];
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
    public List<InquiryTechnicalDetailResponseDto> InquiryTechnicalDetails {get;set;} = [];
}