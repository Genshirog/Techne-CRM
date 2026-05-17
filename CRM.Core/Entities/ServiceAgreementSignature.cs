namespace CRM.Core.Entities;

public class ServiceAgreementSignature
{
    public int Id {get;set;}
    public int ServiceAgreementId {get;set;}
    public string? CustomerSignature {get;set;}
    public DateTime? CustomerDate {get;set;}
    public string ProviderName {get;set;} = string.Empty;
    public string? ProviderSignature {get;set;}
    public DateTime? ProviderDate {get;set;}
    public ServiceAgreement ServiceAgreement {get;set;} = null!;
}
