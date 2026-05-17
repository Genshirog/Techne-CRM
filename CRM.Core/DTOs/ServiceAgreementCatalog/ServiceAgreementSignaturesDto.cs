namespace CRM.Core.DTOs.ServiceAgreementCatalog;

public class UpdateServiceAgreementSignaturesDto
{
    public string? CustomerSignature {get;set;}
    public DateTime? CustomerDate {get;set;}
    public string ProviderName {get;set;} = string.Empty;
    public string? ProviderSignature {get;set;}
    public DateTime? ProvideDate {get;set;}
}

public class ServiceAgreementSignatureResponseDto : UpdateServiceAgreementDto
{
    public int Id {get;set;}
    public int ServiceAgreementId {get;set;}
}
