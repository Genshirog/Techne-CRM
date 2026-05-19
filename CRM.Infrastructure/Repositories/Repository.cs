using CRM.Core.Repositories;
using Microsoft.EntityFrameworkCore;
namespace CRM.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T:class
{
    private readonly AppDbContext _dbContext;
    protected internal readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context){
        _dbContext = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
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
        await _dbContext.SaveChangesAsync();
    }
}
