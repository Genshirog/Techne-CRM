using CRM.Core.Entities;

namespace CRM.Core.Repositories.Billing;

public interface IRefundRepository : IChildRepository<Refund, int>
{
    Task<Refund?> GetByPaymentIdAsync(int paymentId);
}
