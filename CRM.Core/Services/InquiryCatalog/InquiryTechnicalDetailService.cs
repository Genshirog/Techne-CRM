using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;
using CRM.Core.Services.UserCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class InquiryTechnicalDetailService : ChildService<InquiryTechnicalDetail, InquiryTechnicalDetailResponseDto, CreateInquiryTechnicalDetailDto>, IInquiryTechnicalDetailService
{
    private readonly IInquiryTechnicialDetailRepository _repo;
    private readonly IInquiryRepository _inquiryRepo;
    private readonly IInquiryItemRepository _inquiryItemRepo;

    public InquiryTechnicalDetailService(IInquiryTechnicialDetailRepository repo, IInquiryRepository inquiryRepo, IInquiryItemRepository inquiryItemRepo) : base(repo)
    {
        _repo = repo;
        _inquiryRepo = inquiryRepo;
        _inquiryItemRepo = inquiryItemRepo;
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
        CustomerDeviceId = dto.CustomerDeviceId > 0 ? dto.CustomerDeviceId : null,
        Diagnoses = dto.Diagnoses?.Select(d => new InquiryDiagnosis{
            CustomDiagnosis = d.CustomDiagnosis,
            DiagnosisCatalogId = d.DiagnosisCatalogId,
            InquiryTechnicalDetailId = d.InquiryTechnicalDetailId
        }).ToList() ?? [],
        TechnicianId = dto.TechnicianId > 0 ? dto.TechnicianId : null,
        InquryItemId = dto.InquiryItemId,
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
        Technician = entity.Technician is null ? null : new TechnicianResponseDto
        {
            Id = entity.Technician.Id,
            UserId = entity.Technician.UserId,
            Specialization = entity.Technician.Specialization,
            AverageRating = entity.Technician.AverageRating,
            IsAvailable = entity.Technician.IsAvailable,
            TotalReviews = entity.Technician.TotalReviews,
            CreatedAt = entity.Technician.CreatedAt,
        },
    };

    public async Task<InquiryTechnicalDetailResponseDto> AssignTechnicianAsync(int id, AssignTechnicianDto dto)
    {
        var technician = await _repo.AssignTechnicianAsync(id, dto.TechnicianId) ?? throw new Exception($"Not Found");
        var inquiryItem = await _inquiryItemRepo.GetByIdAsync(technician.InquryItemId) ?? throw new Exception($"Not Found");
        var inquiry = await _inquiryRepo.GetByIdAsync(inquiryItem.InquiryId) ?? throw new Exception($"Not Found");

        if (inquiry.Status == InquiryStatus.Pending)
        {
            inquiry.Status = InquiryStatus.Acknowledged;
        }

        _repo.Update(technician);
        _inquiryRepo.Update(inquiry);

        await _repo.SaveChangesAsync();
        await _inquiryRepo.SaveChangesAsync();
        return MapToResponse(technician);
    }

    public async Task<InquiryTechnicalDetailResponseDto> ReAssignTechnicianAsync(int id, AssignTechnicianDto dto)
    {
        var technician = await _repo.AssignTechnicianAsync(id, dto.TechnicianId) 
            ?? throw new Exception("Not Found");

        _repo.Update(technician);
        await _repo.SaveChangesAsync();
        return MapToResponse(technician);
    }
}
