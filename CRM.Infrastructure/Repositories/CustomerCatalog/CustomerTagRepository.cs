using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerCatalog;

public class CustomerTagRepository: Repository<CustomerTag>, ICustomerTagRepository
{
    public CustomerTagRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<CustomerTag>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Include(c => c.Customer).Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public async Task<IEnumerable<CustomerTag>> GetByTagIdAsync(int tagId)
    {
        return await _dbSet.Include(c => c.Tag).Where(c => c.TagId == tagId).ToListAsync();
    }
}
