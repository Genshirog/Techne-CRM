namespace CRM.Core.Entities;

public class QuotationSignature
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
    public string? CustomeSignature {get;set;}
    public DateTime? CustomerDate {get;set;}
    public string ProviderName {get;set;} = string.Empty;
    public string? ProviderSignature {get;set;}
    public DateTime? ProviderDate {get;set;}

    public Quotation Quotation {get;set;} = null!;
    
}
