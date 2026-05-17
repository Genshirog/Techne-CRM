using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.QuotationCatalog;

namespace CRM.Core.Services.QuotationCatalog;

public class QuotationDetailService : ChildService<QuotationDetail, QuotationDetailResponseDto, CreateQuotationDetailDto>, IQuotationDetailService
{
    private readonly IQuotationDetailRepository _repo;

    public QuotationDetailService(IQuotationDetailRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<decimal> GetTotalAmountAsync(int quotationItemId)
    {
        return await _repo.GetTotalAmountAsync(quotationItemId);
    }

    protected override QuotationDetail MapToEntity(CreateQuotationDetailDto dto) => new()
    {
        ItemName = dto.ItemName,
        Quantity = dto.Quantity,
        UnitPrice = dto.UnitPrice
    };

    protected override QuotationDetailResponseDto MapToResponse(QuotationDetail entity) => new()
    {
        Id = entity.Id,
        ItemName = entity.ItemName,
        Quantity = entity.Quantity,
        UnitPrice = entity.UnitPrice,
        QuotationItemId = entity.QuotationItemId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}
