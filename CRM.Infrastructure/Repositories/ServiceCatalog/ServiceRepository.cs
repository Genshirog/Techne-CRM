using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceCatalog;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories.ServiceCatalog;

public class ServiceRepository : Repository<Service>, IServiceRepository
{
    public ServiceRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Service>> GetAllWithCategoryAsync()
    {
        return await _dbSet.Include(c => c.ServiceCategory).ToListAsync();
    }

    public async Task<Service?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet.Include(c => c.ServiceCategory)
        .Include(c => c.Scopes).ThenInclude(c => c.ServiceScopeCases).ThenInclude(c => c.ServiceScopeCaseItems)
        .Include(c => c.Waivers).ThenInclude(c => c.Cases).ThenInclude(c => c.ServiceWaiverCaseItems)
        .Include(c => c.Terms).ThenInclude(c => c.Items)
        .Include(c => c.Deliverables).FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Service>> GetAllByCategoryIdAsync(int id)
    {
        return await _dbSet.Include(c => c.ServiceCategory).Where(c => c.ServiceCategoryId == id).ToListAsync();
    }
}
