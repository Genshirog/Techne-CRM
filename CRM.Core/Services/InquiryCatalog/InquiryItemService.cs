using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class InquiryItemService : ChildService<InquiryItem, InquiryItemResponseDto, CreateInquiryItemDto>, IInquiryItemService
{
    private readonly IInquiryItemRepository _repo;

    public InquiryItemService(IInquiryItemRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<InquiryItemResponseDto>> GetByServiceCategoryIdAsync(int serviceId)
    {
        var entities = await _repo.GetByServiceCategoryIdAsync(serviceId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<InquiryItemResponseDto?> GetWithTechnicalDetailAsync(int id)
    {
        var entity = await _repo.GetWithTechnicalDetailsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    protected override InquiryItem MapToEntity(CreateInquiryItemDto dto) => new()
    {
        InquiryTechnicalDetails = dto.InquiryTechnicalDetails?.Select(td => new InquiryTechnicalDetail{
            CustomerDeviceId = td.CustomerDeviceId > 0 ? td.CustomerDeviceId : null,
            Diagnoses = td.Diagnoses?.Select(d => new InquiryDiagnosis
            {
                CustomDiagnosis = d.CustomDiagnosis,
                DiagnosisCatalogId = d.DiagnosisCatalogId,
                InquiryTechnicalDetailId = d.InquiryTechnicalDetailId
            }).ToList() ?? [],
        }).ToList() ?? [],
        PreferredDate = dto.PreferredDate ?? DateOnly.MinValue,
        PreferredTime = dto.PreferredTime ?? TimeOnly.MinValue,
        ServiceCategoryId = dto.ServiceCategoryId,
    };

    protected override InquiryItemResponseDto MapToResponse(InquiryItem entity) => new()
    {
        Id = entity.Id,
        InquiryId = entity.InquiryId,
        InquiryTechnicalDetails = entity.InquiryTechnicalDetails?.Select(td => new InquiryTechnicalDetailResponseDto{
            Id = td.Id,
            TechnicianId = td.TechnicianId ?? 0,
            Technician = td.Technician is null ? null : new TechnicianResponseDto
            {
                Id = td.Technician.Id,
                UserId = td.Technician.UserId,
                Specialization = td.Technician.Specialization,
                AverageRating = td.Technician.AverageRating,
                IsAvailable = td.Technician.IsAvailable,
                TotalReviews = td.Technician.TotalReviews,
                CreatedAt = td.Technician.CreatedAt,
            },
            CustomerDeviceId = td.CustomerDeviceId,
            Diagnoses = td.Diagnoses?.Select(d => new InquiryDiagnosisResponseDto
            {
                CustomDiagnosis = d.CustomDiagnosis,
                DiagnosisCatalogId = d.DiagnosisCatalogId,
                InquiryTechnicalDetailId = d.InquiryTechnicalDetailId
            }).ToList() ?? [],
        }).ToList() ?? [],
        PreferredDate = entity.PreferredDate,
        PreferredTime = entity.PreferredTime,
        ServiceCategoryId = entity.ServiceCategoryId,    
    };
}
