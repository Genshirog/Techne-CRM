using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public class FeedbackService : GeneralService<Feedback, FeedbackResponseDto, CreateFeedbackDto, UpdateFeedbackDto>, IFeedbackService
{
    private readonly IFeedbackRepository _repo;

    public FeedbackService(IFeedbackRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public async Task<double> GetAverageRatingAsync()
    {
        return await _repo.GetAverageRatingAsync();
    }

    public async Task<double> GetAverageTechnicianRatingAsync(int technicianId)
    {
        return await _repo.GetAverageTechnicianRatingAsync(technicianId);
    }

    public async Task<IEnumerable<FeedbackResponseDto>> GetByCustomerIdAsync(int customerId)
    {
        var entities = await _repo.GetByCustomerIdAsync(customerId) ?? throw new Exception($"Not Found");
        return entities.Select(MapToResponse);
    }

    public async Task<FeedbackResponseDto?> GetByJobOrderIdAsync(int jobOrderId)
    {
        var entity = await _repo.GetByJobOrderIdAsync(jobOrderId) ?? throw new Exception($"Not Found");
        return MapToResponse(entity);
    }

    public override Feedback MapToEntity(CreateFeedbackDto request) => new()
    {
        CustomerId = request.CustomerId,
        JobOrderId = request.JobOrderId,
        OverallRating = request.OverallRating,
        Review = request.Review,
        ServiceComment = request.ServiceComment,
        ServiceRating = request.ServiceRating,
        TechnicianComment = request.TechnicianComment,
        TechnicianRating = request.TechnicianRating
    };

    public override FeedbackResponseDto MapToResponse(Feedback entity) => new()
    {
        Id = entity.Id,
        CustomerId = entity.CustomerId,
        JobOrderId = entity.JobOrderId,
        OverallRating = entity.OverallRating,
        Review = entity.Review,
        ServiceComment = entity.ServiceComment,
        ServiceRating = entity.ServiceRating,
        TechnicianComment = entity.TechnicianComment,
        TechnicianRating = entity.TechnicianRating,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };

    public override async Task<FeedbackResponseDto> UpdateAsync(UpdateFeedbackDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");

        entity.CustomerId = request.CustomerId;
        entity.JobOrderId = request.JobOrderId;
        entity.OverallRating = request.OverallRating;
        entity.Review = request.Review;
        entity.ServiceComment = request.ServiceComment;
        entity.ServiceRating = request.ServiceRating;
        entity.TechnicianComment = request.TechnicianComment;
        entity.TechnicianRating = request.TechnicianRating;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);
    }
}
