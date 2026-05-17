using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class ConversationService : GeneralService<Conversation, ConversationResponseDto, CreateConversationDto, UpdateConversationDto>, IConversationService
{
    private readonly IConversationRepository _repo;

    public ConversationService(IConversationRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<ConversationResponseDto?> GetByInquiryIdAsync(int inquiryId)
    {
        var entity = await _repo.GetByInquiryIdAsync(inquiryId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<ConversationResponseDto?> GetByJobOrderIdAsync(int jobOrderId)
    {
        var entity = await _repo.GetByJobOrderIdAsync(jobOrderId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public async Task<ConversationResponseDto?> GetWithMessageAsync(int id)
    {
        var entity = await _repo.GetWithMessageAsync(id) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override Conversation MapToEntity(CreateConversationDto request) => new()
    {
        InquiryId = request.InquiryId,
        JobOrderId = request.JobOrderId,    
    };

    public override ConversationResponseDto MapToResponse(Conversation entity) => new()
    {
        Id = entity.Id,   
        InquiryId = entity.InquiryId,
        JobOrderId = entity.JobOrderId,
        Messages = entity.Messages?.Select(m => new MessageResponseDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            Body = m.Body,
            AttachmentName = m.AttachmentName,
            AttachmentPath = m.AttachmentPath,
            IsRead = m.IsRead,
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt,
        }).ToList() ?? [],
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt,
    };

    public override async Task<ConversationResponseDto> UpdateAsync(UpdateConversationDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");

        entity.InquiryId = request.InquiryId;
        entity.JobOrderId = request.JobOrderId;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
