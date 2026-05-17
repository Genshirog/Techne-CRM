using CRM.Core.Entities;
using CRM.Core.Repositories.DeviceCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.DeviceCatalog;

public class DeviceModelRepository : Repository<DeviceModel>, IDeviceModelRepository
{
    public DeviceModelRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<DeviceModel>> GetByBrandIdAsync(int brandId)
    {
        return await _dbSet.Where(d => d.DeviceBrandId == brandId).ToListAsync();
    }

    public async Task<IEnumerable<DeviceModel>> GetByDeviceTypeIdAsync(int deviceTypeId)
    {
        return await _dbSet.Include(d => d.DeviceBrand).ThenInclude(d => d.DeviceType).Where(d => d.DeviceBrand.DeviceType.Id == deviceTypeId).ToListAsync();
    }

    public async Task<DeviceModel?> GetByNameAsync(string name)
    {
        return await _dbSet.Where(d => d.Name == name).FirstOrDefaultAsync();
    }
}
