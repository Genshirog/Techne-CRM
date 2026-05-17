using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.InquiryCatalog;

public class DiagnosisCatalogRepository : Repository<DiagnosisCatalog>, IDiagnosisCatalogRepository
{
    public DiagnosisCatalogRepository(AppDbContext context) : base(context){}

    public async Task<DiagnosisCatalog?> GetByNameAsync(string name)
    {
        return await _dbSet.Where(d => d.Name == name).FirstOrDefaultAsync();
    }
}
