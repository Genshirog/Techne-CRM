using CRM.Core.Entities;

namespace CRM.Core.Repositories.InquiryCatalog;

public interface IInquiryItemRepository : IChildRepository<InquiryItem, int>
{
    Task<IEnumerable<InquiryItem>> GetByServiceCategoryIdAsync(int serviceCategoryId);
    Task<InquiryItem?> GetWithTechnicalDetailsAsync(int id);
}
