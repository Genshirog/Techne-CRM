using CRM.Core;
using CRM.Core.Repositories;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories;

public abstract class ChildRepository<T, TParentId> : IChildRepository<T, TParentId> where T:class
{
    private readonly AppDbContext _context;
    protected internal readonly DbSet<T> _dbSet;

    public ChildRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }


    public abstract Task<IEnumerable<T>> GetByParentIdAsync(TParentId parentId);

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
