using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class InquiryDiagnosisService : ChildService<InquiryDiagnosis, InquiryDiagnosisResponseDto, CreateInquiryDiagnosisDto>, IInquiryDiagnosisService
{
    private readonly IInquiryDiagnosisRepository _repo;

    public InquiryDiagnosisService(IInquiryDiagnosisRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<InquiryDiagnosisResponseDto>> GetByDiagnosisCatalogId(int catalogId)
    {
        var entities = await _repo.GetByDiagnosisCatalogIdAsync(catalogId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    protected override InquiryDiagnosis MapToEntity(CreateInquiryDiagnosisDto dto) => new()
    {
        CustomDiagnosis = dto.CustomDiagnosis,
        DiagnosisCatalogId = dto.DiagnosisCatalogId,
        InquiryTechnicalDetailId = dto.InquiryTechnicalDetailId
    };

    protected override InquiryDiagnosisResponseDto MapToResponse(InquiryDiagnosis entity) => new()
    {
        Id = entity.Id,
        CustomDiagnosis = entity.CustomDiagnosis,
        DiagnosisCatalogId = entity.DiagnosisCatalogId,
        InquiryTechnicalDetailId = entity.InquiryTechnicalDetailId,
        CreatedAt = entity.CreatedAt,
    };
}
