using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using CRM.Core.Services.UserCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class InquiryTechnicalDetailService : ChildService<InquiryTechnicalDetail, InquiryTechnicalDetailResponseDto, CreateInquiryTechnicalDetailDto>, IInquiryTechnicalDetailService
{
    private readonly IInquiryTechnicialDetailRepository _repo;

    public InquiryTechnicalDetailService(IInquiryTechnicialDetailRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<InquiryTechnicalDetailResponseDto>> GetByCustomerDeviceIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerDeviceIdAsync(customerId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<InquiryTechnicalDetailResponseDto?> GetWithDiagnosesAsync(int id)
    {
        var entity = await _repo.GetWithDiagnosesAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override InquiryTechnicalDetail MapToEntity(CreateInquiryTechnicalDetailDto dto) => new()
    {
        CustomerDeviceId = dto.CustomerDeviceId??0,
        Diagnoses = dto.Diagnoses?.Select(d => new InquiryDiagnosis{
            CustomDiagnosis = d.CustomDiagnosis,
            DiagnosisCatalogId = d.DiagnosisCatalogId,
            InquiryTechnicalDetailId = d.InquiryTechnicalDetailId
        }).ToList() ?? [],
    };

    protected override InquiryTechnicalDetailResponseDto MapToResponse(InquiryTechnicalDetail entity) => new()
    {
        Id = entity.Id,
        CustomerDeviceId = entity.CustomerDeviceId,
        Diagnoses = entity.Diagnoses?.Select(d => new InquiryDiagnosisResponseDto{
            CustomDiagnosis = d.CustomDiagnosis,
            DiagnosisCatalogId = d.DiagnosisCatalogId,
            InquiryTechnicalDetailId = d.InquiryTechnicalDetailId
        }).ToList() ?? [],
    };
}
