using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerCatalog;

public class CustomerNoteRepository: Repository<CustomerNote>, ICustomerNoteRepository
{
    public CustomerNoteRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<CustomerNote>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Include(c => c.Customer).Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public async Task<IEnumerable<CustomerNote>> SearchByContentAsync(string keyword)
    {
        return await _dbSet.Where(c => c.Note.Contains(keyword)).ToListAsync();
    }
}
