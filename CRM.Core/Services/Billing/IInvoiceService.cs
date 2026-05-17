using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;

namespace CRM.Core.Services.Billing;

public interface IInvoiceService : IGeneralService<InvoiceResponseDto, CreateInvoiceDto ,UpdateInvoiceDto>
{
    Task<InvoiceResponseDto> GetByServiceAgreementIdAsync(int serviceAgreementId);
    Task<IEnumerable<InvoiceResponseDto>> GetByStatusAsync(InvoiceStatus status);
    Task<InvoiceResponseDto> GetWithPaymentsAsync(int id);
}
