using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.InquiryCatalog;

namespace CRM.Core.Services.InquiryCatalog;

public class InquiryService : GeneralService<Inquiry, InquiryResponseDto, CreateInquiryDto, UpdateInquiryDto>, IInquiryService
{
    private readonly IInquiryRepository _repo;

    public InquiryService(IInquiryRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<InquiryResponseDto>> GetByCompanyIdAsync(int companyId)
    {
        var entities = await _repo.GetByCompanyIdAsync(companyId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<InquiryResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerIdAsync(customerId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<InquiryResponseDto>> GetByGuestIdAsync(int guestId)
    {
        var entities = await _repo.GetByGuestIdAsync(guestId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<IEnumerable<InquiryResponseDto>> GetByStatusAsync(InquiryStatus status)
    {
        var entities = await _repo.GetByStatusdAsync(status) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<InquiryResponseDto?> GetWithItemsAsync(int id)
    {
        var entity = await _repo.GetWithItemsAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override Inquiry MapToEntity(CreateInquiryDto request) => new()
    {
        CompanyId = request.CompanyId,
        CustomerId = request.CustomerId,
        GuestId = request.GuestId,
        InquiryItems = request.InquiryItems?.Select(i => new InquiryItem
        {
            PreferredDate = i.PreferredDate ?? DateOnly.MinValue,
            PreferredTime = i.PreferredTime ?? TimeOnly.MinValue,
            ServiceCategoryId = i.ServiceCategoryId,
            InquiryTechnicalDetails = i.InquiryTechnicalDetails?.Select(td => new InquiryTechnicalDetail
            {
                CustomerDeviceId = td.CustomerDeviceId > 0 ? td.CustomerDeviceId : null,
                Diagnoses = td.Diagnoses?.Select(d => new InquiryDiagnosis
                {
                    CustomDiagnosis = d.CustomDiagnosis,
                    DiagnosisCatalogId = d.DiagnosisCatalogId,
                    InquiryTechnicalDetailId = d.InquiryTechnicalDetailId,
                }).ToList() ?? []
            }).ToList() ?? []  
        }).ToList() ?? [],
    };

    public override InquiryResponseDto MapToResponse(Inquiry entity) => new()
    {
        Id = entity.Id,
        CompanyId = entity.CompanyId,
        CustomerId = entity.CustomerId,
        GuestId = entity.GuestId,
        InquiryItems = entity.InquiryItems?.Select(i => new InquiryItemResponseDto
        {
            PreferredDate = i.PreferredDate,
            PreferredTime = i.PreferredTime,
            ServiceCategoryId = i.ServiceCategoryId,
            InquiryTechnicalDetails = i.InquiryTechnicalDetails?.Select(td => new InquiryTechnicalDetailResponseDto
            {
                CustomerDeviceId = td.CustomerDeviceId,
                Diagnoses = td.Diagnoses?.Select(d => new InquiryDiagnosisResponseDto
                {
                    CustomDiagnosis = d.CustomDiagnosis,
                    DiagnosisCatalogId = d.DiagnosisCatalogId,
                    InquiryTechnicalDetailId = d.InquiryTechnicalDetailId,
                }).ToList() ?? []
            }).ToList() ?? []  
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt
    };

    public override Task<InquiryResponseDto> UpdateAsync(UpdateInquiryDto request)
    {
        throw new NotImplementedException();
    }
}
