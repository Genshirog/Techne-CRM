namespace CRM.Core.Entities;

public class InquiryItem
{
    public int Id {get;set;}
    public int InquiryId {get;set;}
    public int ServiceCategoryId {get;set;}
    public DateOnly PreferredDate {get;set;}
    public TimeOnly PreferredTime {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public DateTime? DeletedAt {get;set;}

    public Inquiry Inquiry {get;set;} = null!;
    public ServiceCategory ServiceCategory {get;set;} = null!;
    public ICollection<InquiryTechnicalDetail> InquiryTechnicalDetails {get;set;} = [];
}
