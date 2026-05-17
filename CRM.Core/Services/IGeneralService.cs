namespace CRM.Core.Services;

public interface IGeneralService<TResponse, TCreate, TUpdate>
{
    Task<TResponse?> GetByIdAsync(int id);
    Task<IEnumerable<TResponse>> GetAllAsync();
    Task<TResponse> CreateAsync(TCreate request);
    Task<TResponse> UpdateAsync(TUpdate request);
    Task DeleteAsync(int id);
}
