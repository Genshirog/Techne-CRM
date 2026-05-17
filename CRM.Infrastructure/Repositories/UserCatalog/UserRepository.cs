using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories.UserCatalog;

public class UserRepository : Repository<User>,IUserRepository
{
    public UserRepository(AppDbContext context) : base(context){}

    public async Task<User?> GetByEmailAsync(string email){
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email){
        return await _dbSet.AnyAsync(u => u.Email == email);
    }
}
