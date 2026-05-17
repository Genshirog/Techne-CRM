using System.Dynamic;

namespace CRM.Core.DTOs.JobOrderCatalog;

public class BaseJobOrderReportDto
{
    public int QuotationItemId {get;set;}
    public string? Findings {get;set;}
    public string? ActionsTaken {get;set;}
    public string? Recommendation {get;set;}
}
public class CreateJobOrderReportDto : BaseJobOrderReportDto {}
public class UpdateJobOrderReportDto : BaseJobOrderReportDto {}
public class JobOrderReportResponseDto : BaseJobOrderReportDto
{
    public int Id {get;set;}
    public int JobOrderId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
}