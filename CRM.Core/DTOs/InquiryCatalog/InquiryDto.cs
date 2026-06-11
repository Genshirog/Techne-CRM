using CRM.Core.DTOs.Users;
using CRM.Core.Entities;

namespace CRM.Core.DTOs.InquiryCatalog;

public class BaseInquiryDto
{
    public int? CustomerId {get;set;}
    public int? GuestId {get;set;}
    public int? CompanyId {get;set;}
}

public class CreateInquiryDto : BaseInquiryDto
{
    public CreateGuestDto? Guest { get; set; }
    public List<CreateInquiryItemDto> InquiryItems {get;set;} = [];
}

public class UpdateInquiryDto : BaseInquiryDto
{
    public int Id {get;set;}
    public InquiryStatus? Status {get;set;}
    public List<UpdateInquiryItemDto> InquiryItems {get;set;} = [];
}

public class InquiryResponseDto : BaseInquiryDto
{
    public int Id {get;set;}
    public InquiryStatus Status {get;set;}
    public string? ServiceAddress { get; set; }
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public CustomerResponseDto? Customer { get; set; }
    public GuestResponseDto? Guest { get; set; }
    public List<InquiryItemResponseDto> InquiryItems {get;set;} = [];
    
}
