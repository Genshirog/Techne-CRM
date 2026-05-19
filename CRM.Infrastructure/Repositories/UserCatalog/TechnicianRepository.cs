using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.UserCatalog;

public class TechnicianRepository : Repository<Technician>, ITechnicianRepository
{
    public TechnicianRepository(AppDbContext context) : base(context){}

    public override async Task<IEnumerable<Technician>> GetAllAsync()
    {
        return await _dbSet.Include(t => t.User).ToListAsync();
    }
    public async Task<Technician?> GetByUserIdAsync(int userId)
    {
        return await _dbSet.Include(t => t.User).FirstOrDefaultAsync(t => t.UserId == userId);
    }

    public async Task<IEnumerable<Technician>> GetAllAvailableAsync()
    {
        return await _dbSet.Where(t => t.IsAvailable == true).ToListAsync();
    }
}
