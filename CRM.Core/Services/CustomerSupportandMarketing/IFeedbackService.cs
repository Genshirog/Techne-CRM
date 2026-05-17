using CRM.Core.DTOs.CustomerSupportandMarketing;

namespace CRM.Core.Services.CustomerSupportandMarketing;

public interface IFeedbackService : IGeneralService<FeedbackResponseDto,CreateFeedbackDto,UpdateFeedbackDto>
{
    Task<FeedbackResponseDto?> GetByJobOrderIdAsync(int jobOrderId);
    Task<IEnumerable<FeedbackResponseDto>> GetByCustomerIdAsync(int customerId);
    Task<double> GetAverageRatingAsync();
    Task<double> GetAverageTechnicianRatingAsync(int id);
}
