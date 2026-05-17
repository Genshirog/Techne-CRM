namespace CRM.Core.Repositories;

public interface IChildRepository<T, TParentId> where T : class
{
    Task<IEnumerable<T>> GetByParentIdAsync(TParentId parentId);
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
    
}
