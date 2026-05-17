using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.DeviceCatalog;

public class DeviceBrandRepository : Repository<DeviceBrand>, IDeviceBrandRepository
{
    public DeviceBrandRepository(AppDbContext context) : base(context){}

    public async Task<DeviceBrand?> GetByNameAsync(string name)
    {
        return await _dbSet.Where(c => c.Name == name).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DeviceBrand>> GetWithModelAsync()
    {
        return await _dbSet.Include(c => c.Models).ToListAsync();
    }
}
