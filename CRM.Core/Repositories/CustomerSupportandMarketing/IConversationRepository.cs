using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface IConversationRepository : IRepository<Conversation>
{
    Task<Conversation?> GetByInquiryIdAsync(int inquiryId);
    Task<Conversation?> GetByJobOrderIdAsync(int jobOrderId);
    Task<Conversation?> GetWithMessageAsync(int id);
}
