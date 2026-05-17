using CRM.Core.Entities;
using CRM.Core.Repositories.DeviceCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.DeviceCatalog;

public class CustomerDeviceRepository : Repository<CustomerDevice>, ICustomerDeviceRepository
{
    public CustomerDeviceRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<CustomerDevice>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet.Where(c => c.CustomerId == customerId).ToListAsync();
    }

    public async Task<IEnumerable<CustomerDevice>> GetByDeviceModelAsync(int deviceId)
    {
        return await _dbSet.Where(c => c.DeviceModelId == deviceId).ToListAsync();
    }

    public async Task<CustomerDevice?> GetWithDetailsAsync(int id)
    {
        return await _dbSet.Include(c => c.DeviceModel).ThenInclude(m => m.DeviceBrand).ThenInclude(m => m.DeviceType).FirstOrDefaultAsync(c => c.Id == id);
    }
}
