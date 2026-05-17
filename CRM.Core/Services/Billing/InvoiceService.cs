using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;

namespace CRM.Core.Services.Billing;

public class InvoiceService : GeneralService<Invoice, InvoiceResponseDto, CreateInvoiceDto, UpdateInvoiceDto>, IInvoiceService
{
    private readonly IInvoiceRepository _repo;

    public InvoiceService(IInvoiceRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<InvoiceResponseDto> GetByServiceAgreementIdAsync(int serviceAgreementId)
    {
        var entity = await _repo.GetByServiceAgreementIdAsync(serviceAgreementId) ?? throw new Exception($"Service {serviceAgreementId} not found");
        return MapToResponse(entity);
    }

    public async Task<IEnumerable<InvoiceResponseDto>> GetByStatusAsync(InvoiceStatus status)
    {
        var entity = await _repo.GetByStatusAsync(status);
        return entity.Select(MapToResponse);
    }

    public async Task<InvoiceResponseDto> GetWithPaymentsAsync(int id)
    {
        var entity = await _repo.GetWithPaymentsAsync(id) ?? throw new Exception($"Paymen {id} not found");
        return MapToResponse(entity);
    }

    public override Invoice MapToEntity(CreateInvoiceDto request) => new()
    {
        ServiceAgreementId = request.ServiceAgreementId,
        PromoCodeId = request.PromoCodeId,
        DiagnosisFee = request.DiagnosisFee,
        EstimatedTotal = request.EstimatedTotal,
        FinalTotal = request.FinalTotal,
        DownpaymentAmount = request.DownpaymentAmount,
        BalanceDue = request.BalanceDue,
        DiscountAmount = request.DiscountAmount,
        DueDate = request.DueDate
    };

    public override InvoiceResponseDto MapToResponse(Invoice entity) => new()
    {
        Id = entity.Id,
        ServiceAgreementId = entity.ServiceAgreementId ?? 0,
        PromoCodeId = entity.PromoCodeId,
        BalanceDue = entity.BalanceDue,
        DiagnosisFee = entity.DiagnosisFee,
        EstimatedTotal = entity.EstimatedTotal,
        FinalTotal = entity.FinalTotal,
        DownpaymentAmount = entity.DownpaymentAmount,
        DiscountAmount = entity.DiscountAmount,
        DueDate = entity.DueDate,
        Status = entity.Status,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    public override async Task<InvoiceResponseDto> UpdateAsync(UpdateInvoiceDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception ($"Invoice {request.Id} not found");

        entity.PromoCodeId = request.PromoCodeId;
        entity.DiagnosisFee = request.DiagnosisFee;
        entity.EstimatedTotal = request.EstimatedTotal;
        entity.FinalTotal = request.FinalTotal;
        entity.DownpaymentAmount = request.DownpaymentAmount;
        entity.BalanceDue = request.BalanceDue;
        entity.DiscountAmount = request.DiscountAmount;
        entity.DueDate = request.DueDate;
        entity.Status = request.Status ?? entity.Status;
        entity.UpdatedAt = DateTime.UtcNow;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
