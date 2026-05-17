namespace CRM.Core.Entities;

public class InquiryTechnicalDetail
{
    public int Id {get;set;}
    public int InquryItemId {get;set;}
    public int? CustomerDeviceId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public InquiryItem InquiryItem {get;set;} = null!;
    public CustomerDevice CustomerDevice {get;set;} = null!;
    public ICollection<InquiryDiagnosis> Diagnoses {get;set;} = [];
}
