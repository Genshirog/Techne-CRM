using CRM.Core.Entities;
namespace CRM.Core.Repositories.UserCatalog;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    
}
