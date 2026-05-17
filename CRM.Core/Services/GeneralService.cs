using CRM.Core.Repositories;

namespace CRM.Core.Services;

public abstract class GeneralService<TEntity, TResponse, TCreate, TUpdate>: IGeneralService<TResponse, TCreate, TUpdate> where TEntity:class
{
    protected readonly IRepository<TEntity> _repository;

    public GeneralService(IRepository<TEntity> repository)
    {
        _repository = repository;
    }

    public async Task<TResponse?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if(entity == null) return default;
        return MapToResponse(entity);
    }

    public async Task<IEnumerable<TResponse>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(MapToResponse);
    }

    public async Task<TResponse> CreateAsync(TCreate request)
    {
        var entity = MapToEntity(request);
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id)?? throw new Exception($"Entity with id {id} not found.");
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
    }

    public abstract Task<TResponse> UpdateAsync(TUpdate request);

    public abstract TResponse MapToResponse(TEntity entity);
    public abstract TEntity MapToEntity(TCreate request);
}
