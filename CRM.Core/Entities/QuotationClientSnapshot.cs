namespace CRM.Core.Entities;

public class QuotationClientSnapshot
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
    public string ClientName {get;set;} = string.Empty;
    public string ClientAddress {get;set;} = string.Empty;
    public string ClientEmail {get;set;} = string.Empty;
    public string? ClientLogo {get;set;} = string.Empty;

    public Quotation Quotation {get;set;}=null!;
    
}
