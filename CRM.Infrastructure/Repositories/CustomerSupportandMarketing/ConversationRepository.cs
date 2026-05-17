using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class ConversationRepository: Repository<Conversation>, IConversationRepository
{
    public ConversationRepository(AppDbContext context) : base(context){}

    public async Task<Conversation?> GetByInquiryIdAsync(int inquiryId)
    {
        return await _dbSet.Where(c => c.InquiryId == inquiryId).FirstOrDefaultAsync();
    }

    public async Task<Conversation?> GetByJobOrderIdAsync(int jobOrderId)
    {
        return await _dbSet.Where(c => c.JobOrderId == jobOrderId).FirstOrDefaultAsync();
    }

    public async Task<Conversation?> GetWithMessageAsync(int id)
    {
        return await _dbSet.Include(c => c.Messages).FirstOrDefaultAsync(c => c.Id == id);
    }
}
