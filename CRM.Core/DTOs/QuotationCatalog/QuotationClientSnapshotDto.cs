namespace CRM.Core.DTOs.QuotationCatalog;

public class QuotationClientSnapshotDto
{
    public string ClientName {get;set;} = string.Empty;
    public string ClientAddress {get;set;} = string.Empty;
    public string ClientEmail {get;set;} = string.Empty;
    public string? ClientLogo {get;set;}
}

public class QuotationClientSnapshotResponseDto : QuotationClientSnapshotDto
{
    public int ID {get;set;}
    public int QuotationId {get;set;}
}
