using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class NotificationService : GeneralService<Notification, NotificationResponseDto, CreateNotificationDto, UpdateNotificationDto>, INotificationService
{
    private readonly INotificationRepository _repo;

    public NotificationService(INotificationRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetByUserAsync(int userId)
    {
        var entities = await _repo.GetByUserIdAsync(userId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _repo.GetUnreadCountAsync(userId);
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetUnreadUserIdAsync(int userId)
    {
        var entities = await _repo.GetUnreadByUserIdAsync(userId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public override Notification MapToEntity(CreateNotificationDto request) => new()
    {
        UserId = request.UserId,
        Body = request.Body,
        Link = request.Link,
        Title = request.Title,
    };

    public override NotificationResponseDto MapToResponse(Notification entity) => new()
    {
        Id = entity.Id,
        UserId = entity.UserId,
        Body = entity.Body,
        Link = entity.Link,
        Title = entity.Title,
        CreatedAt = entity.CreatedAt,
    };

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _repo.MarkAllAsReadAsync(userId);
    }

    public override async Task<NotificationResponseDto> UpdateAsync(UpdateNotificationDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        
        entity.UserId = request.UserId;
        entity.Body = request.Body;
        entity.Link = request.Link;
        entity.Title = request.Title;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
