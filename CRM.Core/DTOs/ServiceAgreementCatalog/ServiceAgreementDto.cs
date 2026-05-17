using CRM.Core.Entities;

namespace CRM.Core.DTOs.ServiceAgreementCatalog;

public class BaseServiceAgreementDto
{
    public int JobOrderId {get;set;}
    public int QuotationId {get;set;}
    public decimal FinalLabor {get;set;}
    public decimal FinalParts {get;set;}
    public decimal FinalTotal {get;set;}
    public DateTime? WarrantyStart {get;set;}
    public DateTime? WarrantyEnd {get;set;}
}

public class CreateServiceAgreementDto : BaseServiceAgreementDto{}
public class UpdateServiceAgreementDto : BaseServiceAgreementDto
{
    public int Id {get;set;}
    public ServiceAgreementStatus? Status {get;set;}
}

public class ServiceAgreementResponseDto : BaseServiceAgreementDto
{
    public int Id {get;set;}
    public ServiceAgreementStatus Status {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public ServiceAgreementSignatureResponseDto? Signature {get;set;}
}
