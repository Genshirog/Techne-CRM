using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.UserCatalog;

public class CompanyRepository : Repository<Company>, ICompanyRepository
{
    public CompanyRepository(AppDbContext context) : base(context){}

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _dbSet.AnyAsync(c => c.Email == email);
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _dbSet.AnyAsync(c => c.Name == name);
    }
}
