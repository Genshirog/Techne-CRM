using CRM.Core.Entities;

namespace CRM.Core.Repositories.Billing;

public interface IPaymentRepository : IChildRepository<Payment, int>
{
    Task <IEnumerable<Payment>> GetByStageAsync(int invoiceId, PaymentStage stage);
    Task <Payment?> GetWithRefundAsync(int id);
    Task <decimal> GetTotalPaidAsync(int invoiceId);
}
