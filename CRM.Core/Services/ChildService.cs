using CRM.Core.Repositories;
namespace CRM.Core.Services;

public abstract class ChildService<TEntity, TResponse, TCreate> : IChildService<TEntity, TResponse, TCreate> where TEntity:class where TResponse:class where TCreate:class
{
    private readonly IChildRepository<TEntity, int> _repo;

    protected ChildService(IChildRepository<TEntity, int> repo)
    {
        _repo = repo;
    }

    protected abstract TResponse MapToResponse(TEntity entity);
    protected abstract TEntity MapToEntity(TCreate dto);

    public async Task<IEnumerable<TResponse>> GetByParentIdAsync(int parentId)
    {
        var entities = await _repo.GetByParentIdAsync(parentId);
        return entities.Select(MapToResponse);
    }

    public async Task<TResponse?> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity == null ? null : MapToResponse(entity);
    }

    public async Task<TResponse> CreateAsync(TCreate dto)
    {
        var entity = MapToEntity(dto);
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id) ?? throw new Exception ($"{typeof(TEntity).Name} not found");
        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }
}
