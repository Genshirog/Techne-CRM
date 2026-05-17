namespace CRM.Core.Services;

public interface IChildService<TEntity, TResponse, TCreate> where TEntity :class where TResponse :class where TCreate :class
{
    Task<IEnumerable<TResponse>> GetByParentIdAsync(int parentId);
    Task<TResponse?> GetByIdAsync(int id);
    Task<TResponse> CreateAsync(TCreate dto);
    Task DeleteAsync(int id);
}
