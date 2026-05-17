using CRM.Core.DTOs.Billing;
using CRM.Core.Entities;
using CRM.Core.Repositories.Billing;

namespace CRM.Core.Services.Billing;

public class RefundService : ChildService<Refund, RefundResponseDto, CreateRefundDto>, IRefundService
{
    private readonly IRefundRepository _repo;

    public RefundService(IRefundRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<RefundResponseDto?> GetByPaymentIdAsync(int paymentId)
    {
        var entity = await _repo.GetByPaymentIdAsync(paymentId) ?? throw new Exception($"Payment {paymentId} Not Found");
        return MapToResponse(entity);   
    }

    protected override Refund MapToEntity(CreateRefundDto dto) => new()
    {
        Amount = dto.Amount,
        PaymentId = dto.PaymentId,
        Reason = dto.Reason,
        RefundedBy = dto.RefundedBy,
    };

    protected override RefundResponseDto MapToResponse(Refund entity) => new()
    {
        Id = entity.Id,
        Amount = entity.Amount,
        PaymentId = entity.PaymentId,
        Reason = entity.Reason,
        RefundedBy = entity.RefundedBy,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
