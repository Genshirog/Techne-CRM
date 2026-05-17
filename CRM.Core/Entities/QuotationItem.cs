namespace CRM.Core.Entities;

public class QuotationItem
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
    public int ServiceId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;
    public Quotation Quotation {get;set;} = null!;
    public Service Service {get;set;} = null!;
    public ICollection<QuotationScope> Scopes {get;set;} = [];
    public ICollection<QuotationWaiver> Waivers {get;set;} = [];
    public ICollection<QuotationTerm> Terms {get;set;} = [];
    public ICollection<QuotationDeliverable> Deliverables {get;set;} = [];
    public ICollection<QuotationDetail> Details {get;set;} =[];
}
