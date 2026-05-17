using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.UserCatalog;

public class CustomerRepository : Repository<Customer>, ICustomerRepository
{

    public CustomerRepository(AppDbContext context) : base(context) {}
    
    public async Task<Customer?> GetByUserIdAsync(int userId)
    {
        return await _dbSet.Include(c => c.User).Include(c => c.Company).FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<IEnumerable<Customer>> GetAllWithUserAsync()
    {
        return await _dbSet.Include(c => c.User).ToListAsync();
    }

    public async Task<Customer?> GetByIdWithUserAsync(int id)
    {
        return await _dbSet.Include(c => c.User).Include(c => c.Company).FirstOrDefaultAsync(c => c.Id == id);
    }
}
