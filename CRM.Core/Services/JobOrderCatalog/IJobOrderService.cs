using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.JobOrderCatalog;

public interface IJobOrderService : IGeneralService<JobOrderResponseDto, CreateJobOrderDto, UpdateJobOrderDto>
{
    Task<IEnumerable<JobOrderResponseDto>> GetByStatusAsync(JobOrderStatus status);
    Task<IEnumerable<JobOrderResponseDto>> GetByTechnicianIdAsync(int technicianId);
    Task<JobOrderResponseDto?> GetByQuotationAsync(int quotationId);
    Task<JobOrderResponseDto?> GetWithPartsAsync(int id);
    Task<JobOrderResponseDto?> GetWithReportsAsync(int id);
}
