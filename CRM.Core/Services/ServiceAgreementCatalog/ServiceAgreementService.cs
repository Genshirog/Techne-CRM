using CRM.Core.DTOs.ServiceAgreementCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.ServiceAgreementCatalog;
using CRM.Core.Services.ServiceAgreementCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class ServiceAgreementService : GeneralService<ServiceAgreement, ServiceAgreementResponseDto, CreateServiceAgreementDto, UpdateServiceAgreementDto>, IServiceAgreementService
{
    private readonly IServiceAgreementRepository _repo;

    public ServiceAgreementService(IServiceAgreementRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<ServiceAgreementResponseDto?> GetByJobOrderIdAsync(int jobOrderId)
    {
        var entity = await _repo.GetByJobOrderIdAsync(jobOrderId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<ServiceAgreementResponseDto?> GetByQuotationIdAsync(int quotationId)
    {
        var entity = await _repo.GetByQuotationIdAsync(quotationId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<IEnumerable<ServiceAgreementResponseDto>> GetByStatusAsync(ServiceAgreementStatus status)
    {
        var entities = await _repo.GetByStatusAsync(status) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<ServiceAgreementResponseDto?> GetWithSignatureAsync(int id)
    {
        var entity = await _repo.GetWithSignatureAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override ServiceAgreement MapToEntity(CreateServiceAgreementDto request) => new()
    {
        FinalLabor = request.FinalLabor,
        FinalParts = request.FinalParts,
        FinalTotal = request.FinalTotal,
        JobOrderId = request.JobOrderId,
        QuotationId = request.QuotationId,
        WarrantyEnd = request.WarrantyEnd,
        WarrantyStart = request.WarrantyStart,    
    };

    public override ServiceAgreementResponseDto MapToResponse(ServiceAgreement entity) => new()
    {
        Id = entity.Id,
        FinalLabor = entity.FinalLabor,
        FinalParts = entity.FinalParts,
        FinalTotal = entity.FinalTotal,
        JobOrderId = entity.JobOrderId,
        QuotationId = entity.QuotationId,
        WarrantyEnd = entity.WarrantyEnd,
        WarrantyStart = entity.WarrantyStart,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    public override async Task<ServiceAgreementResponseDto> UpdateAsync(UpdateServiceAgreementDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.FinalLabor = request.FinalLabor;
        entity.FinalParts = request.FinalParts;
        entity.FinalTotal = request.FinalTotal;
        entity.JobOrderId = request.JobOrderId;
        entity.QuotationId = request.QuotationId;
        entity.WarrantyEnd = request.WarrantyEnd;
        entity.WarrantyStart = request.WarrantyStart;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
