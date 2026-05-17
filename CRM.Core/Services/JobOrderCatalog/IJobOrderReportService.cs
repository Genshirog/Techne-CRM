using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.JobOrderCatalog;

public interface IJobOrderReportService : IChildService<JobOrderReport, JobOrderReportResponseDto, CreateJobOrderReportDto>
{
    Task<IEnumerable<JobOrderReportResponseDto>> GetByQuotationItemAsync(int quotationId);
}
