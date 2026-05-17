using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerCatalog;

public class CustomerContactRepository:Repository<CustomerContact>, ICustomerContactRepository
{
    public CustomerContactRepository(AppDbContext context) : base(context) {}

    public async Task<IEnumerable<CustomerContact>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Include(c => c.Customer).Where(c => c.CustomerId == customerId).ToListAsync();
    }
}
