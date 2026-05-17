using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerCatalog;

public class CustomerAddressRepository: Repository<CustomerAddress>, ICustomerAddressRepository
{
    public CustomerAddressRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<CustomerAddress>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Include(c => c.Customer).Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public async Task<CustomerAddress?> GetDefaultByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Include(c => c.Customer).FirstOrDefaultAsync(c => c.CustomerId == customerId && c.IsDefault);
    }
}
