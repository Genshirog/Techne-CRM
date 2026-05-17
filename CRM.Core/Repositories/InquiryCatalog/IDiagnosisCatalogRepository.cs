using CRM.Core.Entities;

namespace CRM.Core.Repositories.InquiryCatalog;

public interface IDiagnosisCatalogRepository : IRepository<DiagnosisCatalog>
{
    //Task<IEnumerable<DiagnosisCatalog>> GetByServiceCategoryIdAsync(int serviceCategoryId);
    Task<DiagnosisCatalog?> GetByNameAsync(string name);
}
