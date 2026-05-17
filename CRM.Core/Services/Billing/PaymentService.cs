using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.Billing;

namespace CRM.Core.Services.Billing;

public class PaymentService : ChildService<Payment, PaymentResponseDto, CreatePaymentDto>, IPaymentService
{
    private readonly IPaymentRepository _repo;

    public PaymentService(IPaymentRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PaymentResponseDto>> GetByStageAsync(int invoiceId, PaymentStage stage)
    {
        var entities = await _repo.GetByStageAsync(invoiceId, stage);
        return entities.Select(MapToResponse);
    }

    public async Task<decimal> GetTotalPaidAsync(int invoiceId)
    {
        return await _repo.GetTotalPaidAsync(invoiceId);
    }

    public async Task<PaymentResponseDto?> GetWithRefundAsync(int id)
    {
        var entities = await _repo.GetWithRefundAsync(id) ?? throw new Exception($"Refund {id} was not found");
        return MapToResponse(entities);
    }

    protected override Payment MapToEntity(CreatePaymentDto dto) => new()
    {
        InvoiceId = dto.InvoiceId,
        Amount = dto.Amount,
        Method = dto.Method,
        PaidAt = dto.PaidAt,
        ProofPath = dto.ProofPath,
        ReceivedBy = dto.ReceivedBy,
        Stage = dto.Stage,
        ReferenceNumber = dto.ReferenceNumber,
    };

    protected override PaymentResponseDto MapToResponse(Payment entity) => new()
    {
        Id = entity.Id,
        InvoiceId = entity.InvoiceId,
        Amount = entity.Amount,
        Method = entity.Method,
        PaidAt = entity.PaidAt,
        ProofPath = entity.ProofPath,
        ReceivedBy = entity.ReceivedBy,
        Stage = entity.Stage,
        ReferenceNumber = entity.ReferenceNumber,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
