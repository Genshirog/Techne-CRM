namespace CRM.Core.Entities;

public class Payment
{
    public int Id {get;set;}
    public int InvoiceId {get;set;}
    public int ReceivedBy {get;set;}
    public PaymentStage Stage {get;set;}
    public decimal Amount {get;set;}
    public PaymentMethod Method {get;set;}
    public string? ReferenceNumber {get;set;}
    public string? ProofPath {get;set;}
    public DateTime PaidAt {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

    public Invoice Invoice {get;set;} = null!;
    public User ReceivedByUser {get;set;} = null!;
    public Refund? Refund {get;set;}
}

public enum PaymentStage
{
    Diagnosis,
    Downpayment,
    Final
}

public enum PaymentMethod
{
    Cash,
    GCash,
    BankTransfer
}