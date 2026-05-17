using CRM.Core.DTOs.ServiceAgreementCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.ServiceAgreementCatalog;

public interface IServiceAgreementService : IGeneralService<ServiceAgreementResponseDto, CreateServiceAgreementDto, UpdateServiceAgreementDto>
{
    Task<ServiceAgreementResponseDto?> GetByJobOrderIdAsync(int jobOrderId);
    Task<ServiceAgreementResponseDto?> GetByQuotationIdAsync(int quotationId);
    Task<IEnumerable<ServiceAgreementResponseDto>> GetByStatusAsync(ServiceAgreementStatus status);
    Task<ServiceAgreementResponseDto?> GetWithSignatureAsync(int id);
}
