namespace CRM.Core.DTOs.QuotationCatalog;

public class UpdateQuotationSignatureDto
{
    public string? CustomerSignature {get;set;}
    public DateTime? CustomerDate {get;set;}
    public string ProviderName {get;set;} = string.Empty;
    public string? ProviderSignature {get;set;}
    public DateTime? ProviderDate {get;set;}
}

public class QuotationSignatureResponseDto : UpdateQuotationSignatureDto
{
    public int Id {get;set;}
    public int QuotationId {get;set;}
}
