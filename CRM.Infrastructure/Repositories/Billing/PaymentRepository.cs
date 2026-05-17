using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.Billing;

public class PaymentRepository : ChildRepository<Payment,int>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<Payment>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(p => p.InvoiceId == parentId).ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetByStageAsync(int invoiceId, PaymentStage stage)
    {
        return await _dbSet.Where(p => p.InvoiceId == invoiceId && p.Stage == stage).ToListAsync();
    }

    public async Task<decimal> GetTotalPaidAsync(int invoiceId)
    {
        return await _dbSet.Where(p => p.InvoiceId == invoiceId).SumAsync(p => p.Amount);
    }

    public async Task<Payment?> GetWithRefundAsync(int id)
    {
        return await _dbSet.Include(p => p.Refund).FirstOrDefaultAsync(p => p.Id == id);
    }
}