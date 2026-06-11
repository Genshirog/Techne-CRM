using CRM.Core;
using CRM.Core.Repositories;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.UserCatalog;

public class GuestRepository: Repository<Guest>, IGuestRepository
{
    public GuestRepository(AppDbContext context) : base(context){}

    public async Task<Guest?> GetByEmailAsync(string email)
    {
        return await _dbSet.Where(c => c.Email == email).FirstOrDefaultAsync();
    }

    public async Task<Guest?> GetByPhoneAsync(string phoneNumber)
    {
        return await _dbSet.Where(c => c.PhoneNumber == phoneNumber).FirstOrDefaultAsync();
    }
}
