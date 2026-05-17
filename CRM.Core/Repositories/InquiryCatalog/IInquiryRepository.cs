using CRM.Core.Entities;

namespace CRM.Core.Repositories.InquiryCatalog;

public interface IInquiryRepository : IRepository<Inquiry>
{
    Task<IEnumerable<Inquiry>> GetByCustomerIdAsync(int customerId);
    Task<IEnumerable<Inquiry>> GetByGuestIdAsync(int guestId);
    Task<IEnumerable<Inquiry>> GetByCompanyIdAsync(int companyId);
    Task<IEnumerable<Inquiry>> GetByStatusdAsync(InquiryStatus status);
    Task<Inquiry?> GetWithItemsAsync(int id);
}
