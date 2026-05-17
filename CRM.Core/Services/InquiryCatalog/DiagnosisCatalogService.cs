using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class DiagnosisCatalogService : GeneralService<DiagnosisCatalog, DiagnosisCatalogResponseDto, CreateDiagnosisCatalogeDto, UpdateDiagnosisCatalogDto>, IDiagnosisCatalogService
{
    private readonly IDiagnosisCatalogRepository _repo;

    public DiagnosisCatalogService(IDiagnosisCatalogRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<DiagnosisCatalogResponseDto?> GetByNameAsync(string name)
    {
        var entity = await _repo.GetByNameAsync(name) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override DiagnosisCatalog MapToEntity(CreateDiagnosisCatalogeDto request) => new()
    {
        Description = request.Description,
        Name = request.Name,    
    };

    public override DiagnosisCatalogResponseDto MapToResponse(DiagnosisCatalog entity) => new()
    {
        Id = entity.Id,
        Description = entity.Description,
        Name = entity.Name,
        CreatedAt = entity.CreatedAt,    
    };

    public override async Task<DiagnosisCatalogResponseDto> UpdateAsync(UpdateDiagnosisCatalogDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.Description = request.Description;
        entity.Name = request.Name;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
