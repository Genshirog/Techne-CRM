using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.DTOs.Users;
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
            IssueDescription = i.IssueDescription,
            Notes = i.Notes,
            Urgency = i.Urgency,
            PreferredDate = i.PreferredDate ?? DateOnly.MinValue,
            PreferredTime = i.PreferredTime ?? TimeOnly.MinValue,
            ServiceCategoryId = i.ServiceCategoryId,
        }).ToList() ?? [],
    };

    public override InquiryResponseDto MapToResponse(Inquiry entity) => new()
    {
        Id = entity.Id,
        Status = entity.Status,
        CompanyId = entity.CompanyId,
        CustomerId = entity.CustomerId,
        GuestId = entity.GuestId,
        InquiryItems = entity.InquiryItems?.Select(i => new InquiryItemResponseDto
        {
            Id = i.Id,
            ServiceCategory = i.ServiceCategory is null ? null : new ServiceCategoryResponseDto
            {
                Id = i.ServiceCategory.Id,
                Name = i.ServiceCategory.Name,
            },
            PreferredDate = i.PreferredDate,
            PreferredTime = i.PreferredTime,
            ServiceCategoryId = i.ServiceCategoryId,
            IssueDescription = i.IssueDescription,
            Urgency = i.Urgency,
            Notes = i.Notes,
            InquiryTechnicalDetails = i.InquiryTechnicalDetails?.Select(td => new InquiryTechnicalDetailResponseDto
            {
                Id = td.Id,
                TechnicianId = td.TechnicianId ?? 0,
                Technician = td.Technician is null ? null : new TechnicianResponseDto
                {
                    Id = td.Technician.Id,
                    User = td.Technician.User is null ? null : new UserResponseDto
                    {
                      Id = td.Technician.User.Id,  
                      Name = td.Technician.User.Name,  
                      Email = td.Technician.User.Email,
                      Role = td.Technician.User.Role,
                      PhoneNumber = td.Technician.User.PhoneNumber,
                      AccessLevel = td.Technician.User.AccessLevel,
                    },
                    UserId = td.Technician.UserId,
                    Specialization = td.Technician.Specialization,
                    AverageRating = td.Technician.AverageRating,
                    IsAvailable = td.Technician.IsAvailable,
                    TotalReviews = td.Technician.TotalReviews,
                    CreatedAt = td.Technician.CreatedAt,
                },
                InquiryItemId = td.InquryItemId,
                CustomerDeviceId = td.CustomerDeviceId,
                Diagnoses = td.Diagnoses?.Select(d => new InquiryDiagnosisResponseDto
                {
                    CustomDiagnosis = d.CustomDiagnosis,
                    DiagnosisCatalogId = d.DiagnosisCatalogId,
                    InquiryTechnicalDetailId = d.InquiryTechnicalDetailId,
                }).ToList() ?? []
            }).ToList() ?? []  
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt,
        Customer    = entity.Customer is null ? null : new CustomerResponseDto
        {
            Id          = entity.Customer.Id,
            Name        = entity.Customer.User?.Name ?? "",
            Email       = entity.Customer.User?.Email ?? "",
            PhoneNumber = entity.Customer.User?.PhoneNumber ?? "",
        },
    };

    public override async Task<InquiryResponseDto> UpdateAsync(UpdateInquiryDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.Status = request.Status ?? entity.Status;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }

    public override async Task<IEnumerable<InquiryResponseDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return entities.Select(MapToResponse);
    }
}
