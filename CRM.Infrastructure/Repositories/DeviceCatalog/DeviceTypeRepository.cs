using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.DeviceCatalog;

public class DeviceTypeRepository : Repository<DeviceType>, IDeviceTypeRepository
{
    public DeviceTypeRepository(AppDbContext context) : base(context){}

    public async Task<DeviceType?> GetByNameAsync(string name)
    {
        return await _dbSet.Where(d => d.Name == name).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<DeviceType>> GetWithModelAsync()
    {
        return await _dbSet.Include(d => d.Brand).ThenInclude(d => d.Models).ToListAsync();
    }
}
