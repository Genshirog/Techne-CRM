using CRM.Core.Entities;

namespace CRM.Core.Repositories.UserCatalog;

public interface ITechnicianRepository : IRepository<Technician>
{
    Task<Technician?> GetByUserIdAsync(int userId);
    Task<IEnumerable<Technician>> GetAllAvailableAsync();
}
