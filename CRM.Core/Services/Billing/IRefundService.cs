using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;

namespace CRM.Core.Services.Billing;

public interface IRefundService : IChildService<Refund, RefundResponseDto, CreateRefundDto>
{
    Task<RefundResponseDto?> GetByPaymentIdAsync(int paymentId);
}
