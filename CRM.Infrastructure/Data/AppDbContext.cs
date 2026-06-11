using Microsoft.EntityFrameworkCore;
using CRM.Core.Entities;
using CRM.Core;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace CRM.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) :base(options){}

    //User Profiles
    public DbSet<User> Users => Set<User>();
    public DbSet<Technician>  Technicians => Set<Technician>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<SuperAdmin> SuperAdmins => Set<SuperAdmin>();
    public DbSet<Guest> Guests => Set<Guest>();

    //Customer Extended
    public DbSet<CustomerContact> CustomerContacts => Set<CustomerContact>();
    public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();
    public DbSet<CustomerNote> CustomerNotes => Set<CustomerNote>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<CustomerTag> CustomerTags => Set<CustomerTag>();

    //Device Cataglog
    public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();
    public DbSet<DeviceBrand> DeviceBrands => Set<DeviceBrand>();
    public DbSet<DeviceModel> DeviceModels => Set<DeviceModel>();
    public DbSet<CustomerDevice> CustomerDevices => Set<CustomerDevice>();

    //Services Catalog
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceScope> ServiceScopes => Set<ServiceScope>();
    public DbSet<ServiceScopeCase> ServiceScopeCases => Set<ServiceScopeCase>();
    public DbSet<ServiceScopeCaseItem> ServiceScopeCaseItems => Set<ServiceScopeCaseItem>();
    public DbSet<ServiceWaiver> ServiceWaivers => Set<ServiceWaiver>();
    public DbSet<ServiceWaiverCase> ServiceWaiverCases => Set<ServiceWaiverCase>();
    public DbSet<ServiceWaiverCaseItem> ServiceWaiverCaseItems => Set<ServiceWaiverCaseItem>();
    public DbSet<ServiceTerm> ServiceTerms => Set<ServiceTerm>();
    public DbSet<ServiceTermItem> ServiceTermItems => Set<ServiceTermItem>();
    public DbSet<ServiceDeliverable> ServiceDeliverables => Set<ServiceDeliverable>();

    //Inquiry Catalog
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<InquiryItem> InquiryItems => Set<InquiryItem>();
    public DbSet<InquiryTechnicalDetail> InquiryTechnicalDetails => Set<InquiryTechnicalDetail>();
    public DbSet<DiagnosisCatalog> DiagnosisCatalogs => Set<DiagnosisCatalog>();
    public DbSet<InquiryDiagnosis> InquiryDiagnoses => Set<InquiryDiagnosis>();

    //Quotation Catalog
    public DbSet<Quotation> Quotations => Set<Quotation>();
    public DbSet<QuotationClientSnapshot> QuotationClientSnapshots => Set<QuotationClientSnapshot>();
    public DbSet<QuotationItem> QuotationItems => Set<QuotationItem>();
    public DbSet<QuotationScope> QuotationScopes => Set<QuotationScope>();
    public DbSet<QuotationScopeCase> QuotationScopeCases => Set<QuotationScopeCase>();
    public DbSet<QuotationScopeCaseItem> QuotationScopeCaseItems => Set<QuotationScopeCaseItem>();
    public DbSet<QuotationWaiver> QuotationWaivers => Set<QuotationWaiver>();
    public DbSet<QuotationWaiverCase> QuotationWaiverCases => Set<QuotationWaiverCase>();
    public DbSet<QuotationWaiverCaseItem> QuotationWaiverCaseItems => Set<QuotationWaiverCaseItem>();
    public DbSet<QuotationTerm> QuotationTerms => Set<QuotationTerm>();
    public DbSet<QuotationTermItem> QuotationTermItems => Set<QuotationTermItem>();
    public DbSet<QuotationDeliverable> QuotationDeliverables => Set<QuotationDeliverable>();
    public DbSet<QuotationDetail> QuotationDetails => Set<QuotationDetail>();
    public DbSet<QuotationSignature> QuotationSignatures => Set<QuotationSignature>();

    //Job Order Catalog
    public DbSet<JobOrder> JobOrders => Set<JobOrder>();
    public DbSet<JobOrderReport> JobOrderReports => Set<JobOrderReport>();
    public DbSet<JobOrderPart> JobOrderParts => Set<JobOrderPart>();

    //Service Agreement Catalog
    public DbSet<ServiceAgreement> ServiceAgreement => Set<ServiceAgreement>();
    public DbSet<ServiceAgreementSignature> ServiceAgreementSignatures => Set<ServiceAgreementSignature>();

    //Billing
    public DbSet<PromoCode> PromoCodes => Set<PromoCode>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Refund> Refunds => Set<Refund>();

    //Customer Support and Marketing
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketReply> TicketReplies => Set<TicketReply>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignTarget> CampaignTargets => Set<CampaignTarget>();
    public DbSet<Notification> Notifications => Set<Notification>();

    //Messaages and Feedback
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        //User Config
        modelBuilder.Entity<User>(entity =>{
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Name).HasMaxLength(100).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(200).IsRequired();
            entity.Property(u => u.PasswordHash).IsRequired();
        });
        //Technician Config
        modelBuilder.Entity<Technician>(entity =>{
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Specialization).HasMaxLength(100).IsRequired();
            entity.Property(t => t.IsAvailable).HasDefaultValue(true);
            entity.Property(t => t.AverageRating).HasDefaultValue(0);
            entity.Property(t => t.TotalReviews).HasDefaultValue(0);
            entity.HasOne(t => t.User).WithOne().HasForeignKey<Technician>(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(t => t.UserId).IsUnique();
        });
        //Company Config
        modelBuilder.Entity<Company>(entity =>{
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.Email).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Address).IsRequired();
            entity.Property(c => c.PhoneNumber).IsRequired();
        });
        //Customer_Company Config
        modelBuilder.Entity<Customer>(entity =>{
            entity.HasKey(c => c.Id);
            entity.Property(c => c.IsPrimary).HasDefaultValue(true);
            entity.HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(c => c.Company).WithMany().HasForeignKey(c => c.CompanyId).OnDelete(DeleteBehavior.SetNull);
        });
        //SuperAdmin
        modelBuilder.Entity<SuperAdmin>(entity =>{
           entity.HasKey(s => s.Id);
           entity.HasOne(s => s.User).WithOne().HasForeignKey<SuperAdmin>(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
           entity.HasIndex(s => s.UserId).IsUnique();

        });
        //Guest
        modelBuilder.Entity<Guest>(entity =>{
            entity.HasKey(g => g.Id);
            entity.Property(g => g.Name).HasMaxLength(150).IsRequired();
            entity.Property(g => g.Email).HasMaxLength(150).IsRequired();
            entity.Property(g => g.PhoneNumber).HasMaxLength(20);
        });
        //CustomerContact
        modelBuilder.Entity<CustomerContact>(entity =>{
            entity.HasKey(c => c.Id);
            entity.HasOne(c => c.Customer).WithMany(c => c.CustomerContacts).HasForeignKey(c => c.CustomerId).OnDelete(DeleteBehavior.Cascade);
            entity.Property(c => c.Type).HasMaxLength(20).IsRequired();
            entity.Property(c => c.Value).HasMaxLength(200).IsRequired();
        });
        //CustomerAddress
        modelBuilder.Entity<CustomerAddress>(entity =>
        {
        entity.HasKey(c => c.Id);

        entity.Property(c => c.Label)
            .HasMaxLength(50)
            .IsRequired();

        entity.OwnsOne(c => c.Address, address =>
        {
            address.Property(a => a.Street)
                .HasColumnName("Street")        // explicit column names
                .HasMaxLength(200)
                .IsRequired();

            address.Property(a => a.Street2)
                .HasColumnName("Street2")
                .HasMaxLength(200)
                .IsRequired(false);

            address.Property(a => a.City)
                .HasColumnName("City")
                .HasMaxLength(100)
                .IsRequired();

            address.Property(a => a.State)
                .HasColumnName("State")
                .HasMaxLength(100)
                .IsRequired();

            address.Property(a => a.PostalCode)
                .HasColumnName("PostalCode")
                .HasMaxLength(20)
                .IsRequired();

            address.Property(a => a.Country)
                .HasColumnName("Country")
                .HasMaxLength(2)
                .IsRequired()
                .HasDefaultValue("PH");
        });

        entity.Property(c => c.IsDefault)
            .HasDefaultValue(false);

        entity.HasOne(c => c.Customer)
            .WithMany(c => c.CustomerAddresses)
            .HasForeignKey(c => c.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
        });
        //CustomerNote
        modelBuilder.Entity<CustomerNote>(entity =>{
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Note).IsRequired();
            entity.HasOne(c => c.Customer).WithMany(c => c.CustomerNotes).HasForeignKey(c => c.CustomerId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(c => c.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
        });
        //Tag
        modelBuilder.Entity<Tag>(entity =>{
           entity.HasKey(t => t.Id);
           entity.Property(t => t.Id).ValueGeneratedOnAdd();
           entity.Property(t => t.Name).HasMaxLength(50).IsRequired();
           entity.Property(t => t.Color).HasMaxLength(20); 
           entity.HasIndex(t => t.Name).IsUnique();
        });
        //CustomerTag
        modelBuilder.Entity<CustomerTag>(entity =>{
            entity.HasKey(ct => ct.Id);
            entity.HasOne(ct => ct.Customer).WithMany(c => c.CustomerTags).HasForeignKey(ct => ct.CustomerId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ct => ct.Tag).WithMany(c => c.CustomerTags).HasForeignKey(ct => ct.TagId).OnDelete(DeleteBehavior.Cascade);

        });
        //DeviceType
        modelBuilder.Entity<DeviceType>(entity =>{
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Name).HasMaxLength(200).IsRequired();
        });
        //DeviceBrand
        modelBuilder.Entity<DeviceBrand>(entity =>{
            entity.HasKey(d => d.Id);
            entity.HasOne(d => d.DeviceType).WithMany(db => db.Brand).HasForeignKey(db => db.DeviceTypeId).OnDelete(DeleteBehavior.Cascade);
            entity.Property(d => d.Name).HasMaxLength(200).IsRequired();
        });
        //DeviceModel
        modelBuilder.Entity<DeviceModel>(entity =>{
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Name).HasMaxLength(200).IsRequired();
            entity.HasOne(d => d.DeviceBrand).WithMany(db => db.Models).HasForeignKey(db => db.DeviceBrandId).OnDelete(DeleteBehavior.Cascade);
        });
        //CustomerDevice
        modelBuilder.Entity<CustomerDevice>(entity =>{
           entity.HasKey(c => c.Id);
           entity.Property(c => c.SerialNumber).HasMaxLength(200);
           entity.HasOne(c => c.Customer).WithMany().HasForeignKey(cd => cd.CustomerId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(c => c.DeviceModel).WithMany(cd => cd.CustomerDevices).HasForeignKey(cd => cd.DeviceModelId).OnDelete(DeleteBehavior.Restrict); 
        });
        //ServiceCategory
        modelBuilder.Entity<ServiceCategory>(entity => {
           entity.HasKey(s => s.Id);
           entity.Property(s => s.Name).HasMaxLength(200).IsRequired();
           entity.Property(s => s.Type).HasConversion<string>();
        });
        //Service
        modelBuilder.Entity<Service>(entity =>{
            entity.HasKey(s => s.Id);
            entity.HasOne(s => s.ServiceCategory).WithMany(sc => sc.Services).HasForeignKey(sc => sc.ServiceCategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(s => s.Name).HasMaxLength(200).IsRequired();
        });
        //ServiceScope
        modelBuilder.Entity<ServiceScope>(entity =>{
            entity.HasKey(s => s.Id);
            entity.HasOne(s => s.Service).WithMany(sv => sv.Scopes).HasForeignKey(sv => sv.ServiceId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceScopeCase
        modelBuilder.Entity<ServiceScopeCase>(entity =>{
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Title).HasMaxLength(100).IsRequired();
            entity.HasOne(s => s.ServiceScope).WithMany(si => si.ServiceScopeCases).HasForeignKey(si => si.ServiceScopeId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceScopeItem
        modelBuilder.Entity<ServiceScopeCaseItem>(entity =>{
            entity.HasKey(si => si.Id);
            entity.Property(si => si.Content).HasMaxLength(300).IsRequired();
            entity.HasOne(si => si.ServiceScopeCase).WithMany(sc => sc.ServiceScopeCaseItems).HasForeignKey(sc => sc.ServiceScopeCaseId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceWaiver
        modelBuilder.Entity<ServiceWaiver>(entity =>{
            entity.HasKey(s => s.Id);
            entity.HasOne(s => s.Service).WithMany(si => si.Waivers).HasForeignKey(si => si.ServiceId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceWaiverCase
        modelBuilder.Entity<ServiceWaiverCase>(entity =>{
            entity.HasKey(s => s.Id);
            entity.HasOne(s => s.ServiceWaiver).WithMany(sw => sw.Cases).HasForeignKey(sw => sw.ServiceWaiverId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceWaiverCaseItem
        modelBuilder.Entity<ServiceWaiverCaseItem>(entity =>{
            entity.HasKey(sw => sw.Id);
            entity.HasOne(sw => sw.ServiceWaiverCase).WithMany(swc => swc.ServiceWaiverCaseItems).HasForeignKey(swc => swc.ServiceWaiverCaseId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceTerm
        modelBuilder.Entity<ServiceTerm>(entity =>
        {
           entity.HasKey(s => s.Id);
           entity.HasOne(s => s.Service).WithMany(st => st.Terms).HasForeignKey(st => st.ServiceId).OnDelete(DeleteBehavior.Cascade); 
        });
        //ServiceTermItem
        modelBuilder.Entity<ServiceTermItem>(entity =>
        {
           entity.HasKey(s => s.Id);
           entity.HasOne(s => s.ServiceTerm).WithMany(st => st.Items).HasForeignKey(st => st.ServiceTermId).OnDelete(DeleteBehavior.Cascade); 
        });
        //ServiceDeliverable
        modelBuilder.Entity<ServiceDeliverable>(entity =>
        {
           entity.HasKey(s => s.Id);
           entity.HasOne(s => s.Service).WithMany(sv => sv.Deliverables).HasForeignKey(sv => sv.ServiceId).OnDelete(DeleteBehavior.Cascade); 
        });
        //Inquiry
        modelBuilder.Entity<Inquiry>(entity =>
        {
           entity.HasKey(i => i.Id);
           entity.Property(i => i.Status).HasConversion<string>();
           entity.HasOne(i => i.Customer).WithMany().HasForeignKey(iq => iq.CustomerId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(i => i.Guest).WithMany().HasForeignKey(iq => iq.GuestId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(i => i.Company).WithMany().HasForeignKey(iq => iq.CompanyId).OnDelete(DeleteBehavior.SetNull); 
        });
        //InquiryItem
        modelBuilder.Entity<InquiryItem>(entity =>
        {
           entity.HasKey(i => i.Id);
           entity.HasOne(i => i.Inquiry).WithMany(i => i.InquiryItems).HasForeignKey(i => i.InquiryId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(i => i.ServiceCategory).WithMany().HasForeignKey(sc => sc.ServiceCategoryId).OnDelete(DeleteBehavior.Restrict);
        });
        //InquiryTechnicalDetail
        modelBuilder.Entity<InquiryTechnicalDetail>(entity =>
        {
           entity.HasKey(i => i.Id);
           entity.HasOne(i => i.CustomerDevice).WithMany().HasForeignKey(i => i.CustomerDeviceId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(i => i.InquiryItem).WithMany(i => i.InquiryTechnicalDetails).HasForeignKey(i => i.InquryItemId).OnDelete(DeleteBehavior.Cascade);
        });
        //DiagnosisCatalog
        modelBuilder.Entity<DiagnosisCatalog>(entity =>
        {
           entity.HasKey(d => d.Id);
           entity.Property(d => d.Name).HasMaxLength(200).IsRequired(); 
        });
        //InquiryDiagnosis
        modelBuilder.Entity<InquiryDiagnosis>(entity =>
        {
           entity.HasKey(i => i.Id);
           entity.HasOne(i => i.DiagnosisCatalog).WithMany().HasForeignKey(i => i.DiagnosisCatalogId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(i => i.InquiryTechnicalDetail).WithMany(i => i.Diagnoses).HasForeignKey(i => i.InquiryTechnicalDetailId).OnDelete(DeleteBehavior.Cascade); 
        });
        //Quotation
        modelBuilder.Entity<Quotation>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.Property(q => q.Status).HasConversion<string>();
            entity.Property(q => q.LaborEstimate).HasPrecision(18,2);
            entity.Property(q => q.PartsEstimate).HasPrecision(18,2);
            entity.Property(q => q.DiagnosisFee).HasPrecision(18,2);
            entity.Property(q => q.GrandTotal).HasPrecision(18,2);
            entity.HasOne(q => q.Inquiry).WithMany().HasForeignKey(q => q.InquiryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(q => q.Customer).WithMany().HasForeignKey(q => q.CustomerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(q => q.Company).WithMany().HasForeignKey(q => q.CompanyId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(q => q.Technician).WithMany().HasForeignKey(q => q.TechnicianId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(q => q.ApprovedByUser).WithMany().HasForeignKey(q => q.ApprovedBy).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationClientSnapshot
        modelBuilder.Entity<QuotationClientSnapshot>(entity =>
        {
           entity.HasKey(q => q.Id);
           entity.HasOne(q => q.Quotation).WithOne(q => q.QuotationClientSnapshot).HasForeignKey<QuotationClientSnapshot>(q => q.QuotationId).OnDelete(DeleteBehavior.Cascade);
        });
        //QuotationItem
        modelBuilder.Entity<QuotationItem>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.Quotation).WithMany(q => q.QuotationItems).HasForeignKey(q => q.QuotationId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.Service).WithMany().HasForeignKey(q => q.ServiceId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationScope
        modelBuilder.Entity<QuotationScope>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationItem).WithMany(q => q.Scopes).HasForeignKey(q => q.QuotationItemId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceScope).WithMany().HasForeignKey(q => q.ServiceScopeId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationScopeCase
        modelBuilder.Entity<QuotationScopeCase>(entity =>
        {
           entity.HasKey(q => q.Id);
           entity.HasOne(q => q.QuotationScope).WithMany(q => q.Cases).HasForeignKey(q => q.QuotationScopeId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(q => q.ServiceScopeCase).WithMany().HasForeignKey(q => q.ServiceScopeCaseId).OnDelete(DeleteBehavior.Restrict); 
        });
        //QuotationScopeItem
        modelBuilder.Entity<QuotationScopeCaseItem>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationScopeCase).WithMany(q => q.Items).HasForeignKey(q => q.QuotationScopeCaseId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceScopeCaseItem).WithMany().HasForeignKey(q => q.ServiceScopeCaseItemId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationWaiver
        modelBuilder.Entity<QuotationWaiver>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationItem).WithMany(q => q.Waivers).HasForeignKey(q => q.QuotationItemId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceWaiver).WithMany().HasForeignKey(q => q.ServiceWaiverId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationWaiverCase
        modelBuilder.Entity<QuotationWaiverCase>(entity =>
        {
           entity.HasKey(q => q.Id);
           entity.HasOne(q => q.QuotationWaiver).WithMany(q => q.Cases).HasForeignKey(q => q.QuotationWaiverId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(q => q.ServiceWaiverCase).WithMany().HasForeignKey(q => q.ServiceWaiverCaseId).OnDelete(DeleteBehavior.Restrict); 
        });
        //QuotationWaiverCaseItem
        modelBuilder.Entity<QuotationWaiverCaseItem>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationWaiverCase).WithMany(q => q.Items).HasForeignKey(q => q.QuotationWaiverCaseId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceWaiverCaseItem).WithMany().HasForeignKey(q => q.ServiceWaiverCaseItemId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationTerm
        modelBuilder.Entity<QuotationTerm>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationItem).WithMany(q => q.Terms).HasForeignKey(q => q.QuotationItemId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceTerm).WithMany().HasForeignKey(q => q.ServiceTermId).OnDelete(DeleteBehavior.Restrict);
        }); 
        //QuotationTermItem
        modelBuilder.Entity<QuotationTermItem>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationTerm).WithMany(q => q.Items).HasForeignKey(q => q.QuotationTermId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceTermItem).WithMany().HasForeignKey(q => q.ServiceTermItemId).OnDelete(DeleteBehavior.Restrict);
        });
        //QuotationDeliverables
        modelBuilder.Entity<QuotationDeliverable>(entity => 
        {
            entity.HasKey(q => q.Id);
            entity.HasOne(q => q.QuotationItem).WithMany(q => q.Deliverables).HasForeignKey(q => q.QuotationItemId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(q => q.ServiceDeliverable).WithMany().HasForeignKey(q => q.ServiceDeliverableId).OnDelete(DeleteBehavior.Restrict);    
        });
        //QuotationDetails
        modelBuilder.Entity<QuotationDetail>(entity =>
        {
           entity.HasKey(q => q.Id);
           entity.Property(q => q.ItemName).HasMaxLength(200).IsRequired();
           entity.Property(q => q.UnitPrice).HasPrecision(18,2);
           entity.HasOne(q => q.QuotationItem).WithMany(q => q.Details).HasForeignKey(q => q.QuotationItemId).OnDelete(DeleteBehavior.Cascade); 
        });
        //QuotationSignature
        modelBuilder.Entity<QuotationSignature>(entity =>
        {
           entity.HasKey(q => q.Id);
           entity.Property(q => q.ProviderName).HasMaxLength(200);
           entity.HasOne(q => q.Quotation).WithOne(q => q.Signature).HasForeignKey<QuotationSignature>(q => q.QuotationId).OnDelete(DeleteBehavior.Cascade); 
        });
        //JobOrder
        modelBuilder.Entity<JobOrder>(entity =>
        {
           entity.HasKey(j => j.Id);
           entity.Property(j => j.Status).HasConversion<string>();
           entity.HasOne(j => j.Quotation).WithMany().HasForeignKey(j => j.QuotationId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(j => j.Technician).WithMany().HasForeignKey(j => j.TechnicianId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(j => j.AssignedByUser).WithMany().HasForeignKey(j => j.AssignedBy).OnDelete(DeleteBehavior.Restrict);
        });
        //JobOrderReport
        modelBuilder.Entity<JobOrderReport>(entity =>
        {
           entity.HasKey(j => j.Id);
           entity.HasOne(j => j.JobOrder).WithMany(j => j.Reports).HasForeignKey(j => j.JobOrderId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(j => j.QuotationItem).WithMany().HasForeignKey(j => j.QuotationItemId).OnDelete(DeleteBehavior.Restrict); 
        });
        //JobOrderPart
        modelBuilder.Entity<JobOrderPart>(entity =>
        {
           entity.HasKey(j => j.Id);
           entity.Property(j => j.PartName).HasMaxLength(200).IsRequired();
           entity.Property(j => j.UnitPrice).HasPrecision(18,2);
           entity.HasOne(j => j.JobOrder).WithMany(j => j.Parts).HasForeignKey(j => j.JobOrderId).OnDelete(DeleteBehavior.Cascade);
        });
        //ServiceAgreement
        modelBuilder.Entity<ServiceAgreement>(entity =>
        {
           entity.HasKey(s => s.Id);
           entity.Property(s => s.Status).HasConversion<string>();
           entity.Property(s => s.FinalLabor).HasPrecision(18,2);
           entity.Property(s => s.FinalParts).HasPrecision(18,2);
           entity.Property(s => s.FinalTotal).HasPrecision(18,2);
           entity.HasOne(s => s.JobOrder).WithOne().HasForeignKey<ServiceAgreement>(s => s.JobOrderId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(s => s.Quotation).WithMany().HasForeignKey(s => s.QuotationId).OnDelete(DeleteBehavior.Restrict); 
        });
        //ServiceAgreementSignature
        modelBuilder.Entity<ServiceAgreementSignature>(entity =>
        {
           entity.HasKey(s => s.Id);
           entity.Property(s => s.ProviderName).HasMaxLength(200).IsRequired();
           entity.HasOne(s => s.ServiceAgreement).WithOne(s => s.Signature).HasForeignKey<ServiceAgreementSignature>(s => s.ServiceAgreementId).OnDelete(DeleteBehavior.Cascade);
        });
        //PromoCode
        modelBuilder.Entity<PromoCode>(entity =>
        {
           entity.HasKey(p => p.Id);
           entity.Property(p => p.Code).HasMaxLength(50).IsRequired();
           entity.HasIndex(p => p.Code).IsUnique();
           entity.Property(p => p.DiscountType).HasConversion<string>();
           entity.Property(p => p.DiscountValue).HasPrecision(18,2); 
           entity.HasOne(p => p.Campaign).WithMany(p => p.PromoCodes).HasForeignKey(p => p.CampaignId).OnDelete(DeleteBehavior.SetNull);
        });
        //Invoice
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Status).HasConversion<string>();
            entity.Property(i => i.DiagnosisFee).HasPrecision(18,2);
            entity.Property(i => i.EstimatedTotal).HasPrecision(18,2);
            entity.Property(i => i.FinalTotal).HasPrecision(18,2);
            entity.Property(i => i.DownpaymentAmount).HasPrecision(18,2);
            entity.Property(i => i.BalanceDue).HasPrecision(18,2);
            entity.Property(i => i.DiscountAmount).HasPrecision(18,2);
            entity.HasOne(i => i.ServiceAgreement).WithOne().HasForeignKey<Invoice>(i => i.ServiceAgreementId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(i => i.PromoCode).WithMany().HasForeignKey(i => i.PromoCodeId).OnDelete(DeleteBehavior.SetNull);
        });
        //Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Stage).HasConversion<string>();
            entity.Property(p => p.Method).HasConversion<string>();
            entity.Property(p => p.Amount).HasPrecision(18,2);
            entity.HasOne(p => p.Invoice).WithMany(p => p.Payments).HasForeignKey(p => p.InvoiceId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(p => p.ReceivedByUser).WithMany().HasForeignKey(p => p.ReceivedBy).OnDelete(DeleteBehavior.Restrict);
        });
        //Refund
        modelBuilder.Entity<Refund>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Amount).HasPrecision(18,2);
            entity.Property(r => r.Reason).IsRequired();
            entity.HasOne(r => r.Payment).WithOne(r => r.Refund).HasForeignKey<Refund>(r => r.PaymentId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(r => r.RefundedByUser).WithMany().HasForeignKey(r => r.RefundedBy).OnDelete(DeleteBehavior.Restrict);
        });
        //Ticket
        modelBuilder.Entity<Ticket>(entity =>
        {
           entity.HasKey(t => t.Id);
           entity.Property(t => t.Title).HasMaxLength(200).IsRequired();
           entity.Property(t => t.Category).HasConversion<string>();
           entity.Property(t => t.Priority).HasConversion<string>();
           entity.Property(t => t.Status).HasConversion<string>();
           entity.HasOne(t => t.AssignedToUser).WithMany().HasForeignKey(t => t.AssignedTo).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(t => t.JobOrder).WithMany().HasForeignKey(t => t.JobOrderId).OnDelete(DeleteBehavior.SetNull);
           entity.HasOne(t => t.Customer).WithMany().HasForeignKey(t => t.CustomerId).OnDelete(DeleteBehavior.Restrict); 
        });
        //TicketReply
        modelBuilder.Entity<TicketReply>(entity =>
        {
           entity.HasKey(t => t.Id);
           entity.Property(t => t.Body).IsRequired();
           entity.HasOne(t => t.Ticket).WithMany(t => t.Replies).HasForeignKey(t => t.TicketId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(t => t.Sender).WithMany().HasForeignKey(t => t.SenderId).OnDelete(DeleteBehavior.Restrict); 
        });
        //Campaign
        modelBuilder.Entity<Campaign>(entity =>
        {
           entity.HasKey(c => c.Id);
           entity.Property(c => c.Title).HasMaxLength(50).IsRequired();
           entity.Property(c => c.Channel).HasConversion<string>();
           entity.Property(c => c.Status).HasConversion<string>();
           entity.HasOne(c => c.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict); 
        });
        //CampaignTarget
        modelBuilder.Entity<CampaignTarget>(entity =>
        {
           entity.HasKey(c => c.Id);
           entity.HasOne(c => c.Campaign).WithMany(c => c.Targets).HasForeignKey(c => c.CampaignId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(c => c.Customer).WithMany().HasForeignKey(c => c.CustomerId).OnDelete(DeleteBehavior.Restrict);
        });
        //Notification
        modelBuilder.Entity<Notification>(entity => 
        {
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Body).IsRequired();
            entity.Property(n => n.Title).HasMaxLength(50).IsRequired();
            entity.HasOne(n => n.User).WithMany().HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Restrict);   
        });
        //Conversation
        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasOne(c => c.Inquiry).WithMany().HasForeignKey(c => c.InquiryId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(c => c.JobOrder).WithMany().HasForeignKey(c => c.JobOrderId).OnDelete(DeleteBehavior.SetNull);
        });
        //Message
        modelBuilder.Entity<Message>(entity =>
        {
           entity.HasKey(m => m.Id);
           entity.Property(m => m.Body).IsRequired();
           entity.HasOne(m => m.Conversation).WithMany(m => m.Messages).HasForeignKey(m => m.ConversationId).OnDelete(DeleteBehavior.Cascade);
           entity.HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);
        });
        //Feedback
        modelBuilder.Entity<Feedback>(entity =>
        {
           entity.HasKey(f => f.Id);
           entity.HasIndex(f => f.JobOrderId).IsUnique();
           entity.HasOne(f => f.JobOrder).WithMany().HasForeignKey(f => f.JobOrderId).OnDelete(DeleteBehavior.Restrict);
           entity.HasOne(f => f.Customer).WithMany().HasForeignKey(f => f.CustomerId).OnDelete(DeleteBehavior.Restrict); 
        });
    }
}
