using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.Billing;

public class RefundRepository : ChildRepository<Refund, int>, IRefundRepository
{
    public RefundRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<Refund>> GetByParentIdAsync(int parentId)
    {
        return await _dbSet.Where(r => r.PaymentId == parentId).ToListAsync();
    }

    public async Task<Refund?> GetByPaymentIdAsync(int paymentId)
    {
        return await _dbSet.Where(p => p.PaymentId == paymentId).FirstOrDefaultAsync();
    }
}
