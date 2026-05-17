using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;

namespace CRM.Core.Services.Billing;

public interface IPaymentService : IChildService<Payment, PaymentResponseDto, CreatePaymentDto>
{
    Task<IEnumerable<PaymentResponseDto>> GetByStageAsync(int invoiceId, PaymentStage stage);
    Task<PaymentResponseDto?> GetWithRefundAsync(int id);
    Task<decimal> GetTotalPaidAsync(int invoiceId);
}
