using CRM.Core.Entities;

namespace CRM.Core.DTOs.JobOrderCatalog;

public class BaseJobOrderDto
{
    public int QuotationId {get;set;}
    public int? TechnicianId {get;set;}
    public int? AssignedBy {get;set;}
    public DateTime? AssignedAt {get;set;}
    public DateTime? StartDate {get;set;}
    public DateTime? ExpectedFinishedDate {get;set;}
    public string? TechnicianNotes {get;set;}
}

public class CreateJobOrderDto : BaseJobOrderDto
{
    public List<CreateJobOrderPartDto> Parts {get;set;} = [];
    public List<CreateJobOrderReportDto> Reports {get;set;} = [];
}

public class UpdateJobOrderDto : BaseJobOrderDto
{
    public int Id {get;set;}
    public List<UpdateJobOrderPartDto> Parts {get;set;} = [];
    public List<UpdateJobOrderReportDto> Reports {get;set;} = [];
}

public class JobOrderResponseDto : BaseJobOrderDto
{
    public int Id {get;set;}
    public JobOrderStatus Status {get;set;}
    public DateTime? CompletedAt {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UpdatedAt {get;set;}
    public List<JobOrderPartResponseDto> Parts {get;set;} = [];
    public List<JobOrderReportResponseDto> Reports {get;set;} = [];
}