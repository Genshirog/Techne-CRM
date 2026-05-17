using CRM.Core.DTOs.InquiryCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public interface IDiagnosisCatalogService : IGeneralService<DiagnosisCatalogResponseDto, CreateDiagnosisCatalogeDto, UpdateDiagnosisCatalogDto>
{
    Task<DiagnosisCatalogResponseDto?> GetByNameAsync(string name);
}
