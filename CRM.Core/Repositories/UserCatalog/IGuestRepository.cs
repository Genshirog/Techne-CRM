namespace CRM.Core.Repositories.UserCatalog;

public interface IGuestRepository : IRepository<Guest>
{
    Task<Guest?> GetByEmailAsync(string email);
    Task<Guest?> GetByPhoneAsync(string phoneNumber);
}
