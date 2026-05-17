namespace CRM.Core.Entities;

public class Refund
{
    public int Id {get;set;}
    public int PaymentId {get;set;}
    public int RefundedBy {get;set;}
    public decimal Amount {get;set;}
    public string Reason {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Payment Payment {get;set;} = null!;
    public User RefundedByUser {get;set;} = null!;
}
