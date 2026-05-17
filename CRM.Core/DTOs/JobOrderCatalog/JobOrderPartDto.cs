namespace CRM.Core.DTOs.JobOrderCatalog;

public class BaseJobOrderPartDto
{
    public string PartName {get;set;} = string.Empty;
    public int Quantity {get;set;}
    public decimal UnitPrice {get;set;}
}
public class CreateJobOrderPartDto : BaseJobOrderPartDto {}
public class UpdateJobOrderPartDto : BaseJobOrderPartDto {}
public class JobOrderPartResponseDto : BaseJobOrderPartDto
{
    public int Id {get; set;}
    public int JobOrderId {get;set;}
    public DateTime CreatedAt {get;set;}
    public DateTime UdatedAt {get;set;}
}