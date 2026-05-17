using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class TicketService : GeneralService<Ticket, TicketResponseDto, CreateTicketDto, UpdateTicketDto>, ITicketService
{
    private readonly ITicketRepository _repo;

    public TicketService(ITicketRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public override Ticket MapToEntity(CreateTicketDto request) => new()
    {
        AssignedTo = request.AssignedTo,
        Category = request.Category,
        CustomerId = request.CustomerId,
        JobOrderId = request.JobOrderId,
        Priority = request.Priority,
        Replies = request.Replies?.Select(r => new TicketReply
        {
            Attachment = r.Attachment,
            Body = r.Body,
            SenderId = r.SenderId,
            TicketId = r.TicketId,
        }).ToList() ?? [] ,
        Title = request.Title,   
    };

    public override TicketResponseDto MapToResponse(Ticket entity) => new()
    {
        Id = entity.Id,
        AssignedTo = entity.AssignedTo,
        Category = entity.Category,
        CustomerId = entity.CustomerId,
        JobOrderId = entity.JobOrderId,
        Priority = entity.Priority,
        Replies = entity.Replies?.Select(r => new TicketReplyResponseDto
        {
            Id = r.Id,
            Attachment = r.Attachment,
            Body = r.Body,
            SenderId = r.SenderId,
            TicketId = r.TicketId,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        }).ToList() ?? [] ,
        Title = entity.Title,    
        Status = entity.Status,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    public override async Task<TicketResponseDto> UpdateAsync(UpdateTicketDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.AssignedTo = request.AssignedTo;
        entity.Category = request.Category;
        entity.CustomerId = request.CustomerId;
        entity.JobOrderId = request.JobOrderId;
        entity.Priority = request.Priority;
        entity.Replies = request.Replies?.Select(r => new TicketReply
        {
            Attachment = r.Attachment,
            Body = r.Body,
            SenderId = r.SenderId,
            TicketId = r.TicketId,
        }).ToList() ?? [] ;
        entity.Title = request.Title;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
