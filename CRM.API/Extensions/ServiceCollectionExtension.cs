using CRM.Core;
using CRM.Core.DTOs.Billing;
using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.DTOs.DeviceCatalog;
using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.DTOs.JobOrderCatalog;
using CRM.Core.DTOs.QuotationCatalog;
using CRM.Core.DTOs.ServiceCatalog;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories;
using CRM.Core.Repositories.Billing;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using CRM.Core.Repositories.DeviceCatalog;
using CRM.Core.Repositories.InquiryCatalog;
using CRM.Core.Repositories.JobOrderCatalog;
using CRM.Core.Repositories.QuotationCatalog;
using CRM.Core.Repositories.ServiceAgreementCatalog;
using CRM.Core.Repositories.ServiceCatalog;
using CRM.Core.Repositories.UserCatalog;
using CRM.Core.Services;
using CRM.Core.Services.Billing;
using CRM.Core.Services.CustomerSupportandMarketing;
using CRM.Core.Services.DeviceCatalog;
using CRM.Core.Services.InquiryCatalog;
using CRM.Core.Services.JobOrderCatalog;
using CRM.Core.Services.QuotationCatalog;
using CRM.Core.Services.ServiceAgreementCatalog;
using CRM.Core.Services.ServiceCatalog;
using CRM.Core.Services.UserCatalog;
using CRM.Infrastructure.Repositories;
using CRM.Infrastructure.Repositories.Billing;
using CRM.Infrastructure.Repositories.CustomerSupportandMarketing;
using CRM.Infrastructure.Repositories.DeviceCatalog;
using CRM.Infrastructure.Repositories.InquiryCatalog;
using CRM.Infrastructure.Repositories.JobOrderCatalog;
using CRM.Infrastructure.Repositories.QuotationCatalog;
using CRM.Infrastructure.Repositories.ServiceAgreementCatalog;
using CRM.Infrastructure.Repositories.ServiceCatalog;
using CRM.Infrastructure.Repositories.UserCatalog;

namespace CRM.API.Extensions;

public static class ServiceCollectionExtension
{
    // ─── Repositories ─────────────────────────────────────────────────────────

    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        // Service Catalog
        services.AddScoped<IServiceCategoryRepository, ServiceCategoryRepository>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IChildRepository<ServiceScope, int>, ServiceScopeRepository>();
        services.AddScoped<IChildRepository<ServiceScopeCase, int>, ServiceScopeCaseRepository>();
        services.AddScoped<IChildRepository<ServiceScopeCaseItem, int>, ServiceScopeCaseItemRepository>();
        services.AddScoped<IChildRepository<ServiceWaiver, int>, ServiceWaiverRepository>();
        services.AddScoped<IChildRepository<ServiceWaiverCase, int>, ServiceWaiverCaseRepository>();
        services.AddScoped<IChildRepository<ServiceWaiverCaseItem, int>, ServiceWaiverCaseItemRepository>();
        services.AddScoped<IChildRepository<ServiceTerm, int>, ServiceTermRepository>();
        services.AddScoped<IChildRepository<ServiceTermItem, int>, ServiceTermItemRepository>();
        services.AddScoped<IChildRepository<ServiceDeliverable, int>, ServiceDeliverableRepository>();

        // Billing
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddScoped<IPromoCodeRepository, PromoCodeRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IChildRepository<Payment, int>, PaymentRepository>();
        services.AddScoped<IRefundRepository, RefundRepository>();
        services.AddScoped<IChildRepository<Refund, int>, RefundRepository>();

        // Inquiry
        services.AddScoped<IInquiryRepository, InquiryRepository>();
        services.AddScoped<IDiagnosisCatalogRepository, DiagnosisCatalogRepository>();
        services.AddScoped<IInquiryItemRepository, InquiryItemRepository>();
        services.AddScoped<IChildRepository<InquiryItem, int>, InquiryItemRepository>();
        services.AddScoped<IInquiryTechnicialDetailRepository, InquiryTechnicalDetailRepository>();
        services.AddScoped<IChildRepository<InquiryTechnicalDetail, int>, InquiryTechnicalDetailRepository>();
        services.AddScoped<IInquiryDiagnosisRepository, InquiryDiagnosisRepository>();
        services.AddScoped<IChildRepository<InquiryDiagnosis, int>, InquiryDiagnosisRepository>();

        // Job Order
        services.AddScoped<IJobOrderRepository, JobOrderRepository>();
        services.AddScoped<IJobOrderPartRepository, JobOrderPartRepository>();
        services.AddScoped<IChildRepository<JobOrderPart, int>, JobOrderPartRepository>();
        services.AddScoped<IJobOrderReportRepository, JobOrderReportRepository>();
        services.AddScoped<IChildRepository<JobOrderReport, int>, JobOrderReportRepository>();

        // Quotation — no specific interfaces, just generic
        services.AddScoped<IQuotationRepository, QuotationRepository>();
        services.AddScoped<IServiceAgreementRepository, ServiceAgreementRepository>();
        services.AddScoped<IQuotationItemRepository, QuotationItemRepository>();
        services.AddScoped<IChildRepository<QuotationItem, int>, QuotationItemRepository>();
        services.AddScoped<IQuotationDetailRepository, QuotationDetailRepository>();
        services.AddScoped<IChildRepository<QuotationDetail, int>, QuotationDetailRepository>();
        services.AddScoped<IQuotationDeliverableRepository, QuotationDeliverableRepository>();
        services.AddScoped<IChildRepository<QuotationDeliverable, int>, QuotationDeliverableRepository>();
        services.AddScoped<IQuotationScopeRepository, QuotationScopeRepository>();
        services.AddScoped<IChildRepository<QuotationScope, int>, QuotationScopeRepository>();
        services.AddScoped<IQuotationScopeCaseRepository, QuotationScopeCaseRepository>();
        services.AddScoped<IChildRepository<QuotationScopeCase, int>, QuotationScopeCaseRepository>();
        services.AddScoped<IQuotationScopeCaseItemRepository, QuotationScopeCaseItemRepository>();
        services.AddScoped<IChildRepository<QuotationScopeCaseItem, int>, QuotationScopeCaseItemRepository>();
        services.AddScoped<IQuotationTermRepository, QuotationTermRepository>();
        services.AddScoped<IChildRepository<QuotationTerm, int>, QuotationTermRepository>();
        services.AddScoped<IQuotationTermItemRepository, QuotationTermItemRepository>();
        services.AddScoped<IChildRepository<QuotationTermItem, int>, QuotationTermItemRepository>();
        services.AddScoped<IQuotationWaiverRepository, QuotationWaiverRepository>();
        services.AddScoped<IChildRepository<QuotationWaiver, int>, QuotationWaiverRepository>();
        services.AddScoped<IQuotationWaiverCaseRepository, QuotationWaiverCaseRepository>();
        services.AddScoped<IChildRepository<QuotationWaiverCase, int>, QuotationWaiverCaseRepository>();
        services.AddScoped<IQuotationWaiverCaseItemRepository, QuotationWaiverCaseItemRepository>();
        services.AddScoped<IChildRepository<QuotationWaiverCaseItem, int>, QuotationWaiverCaseItemRepository>();

        // Customer Support
        services.AddScoped<ICampaignRepository, CampaignRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IFeedbackRepository, FeedbackRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<ITicketRepository, TicketRepository>();
        services.AddScoped<ICampaignTargetRepository, CampaignTargetRepository>();
        services.AddScoped<IChildRepository<CampaignTarget, int>, CampaignTargetRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IChildRepository<Message, int>, MessageRepository>();
        services.AddScoped<ITicketRepliesRepository, TicketReplyRepository>();
        services.AddScoped<IChildRepository<TicketReply, int>, TicketReplyRepository>();

        // Customer Device
        services.AddScoped<ICustomerDeviceRepository, CustomerDeviceRepository>();
        services.AddScoped<IDeviceBrandRepository, DeviceBrandRepository>();
        services.AddScoped<IDeviceModelRepository, DeviceModelRepository>();
        services.AddScoped<IDeviceTypeRepository, DeviceTypeRepository>();

        // User
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<ITechnicianRepository, TechnicianRepository>();
        return services;
    }

    // ─── Services ─────────────────────────────────────────────────────────────

    public static IServiceCollection AddServiceCatalog(this IServiceCollection services)
    {
        services.AddScoped<IServiceCategoryService, ServiceCategoryService>();
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<IChildService<ServiceScope, ServiceScopeResponseDto, CreateServiceScopeDto>, ServiceScopeService>();
        services.AddScoped<IChildService<ServiceScopeCase, ServiceScopeCaseResponseDto, CreateServiceScopeCaseDto>, ServiceScopeCaseService>();
        services.AddScoped<IChildService<ServiceScopeCaseItem, ServiceScopeCaseItemResponseDto, CreateServiceScopeCaseItemDto>, ServiceScopeCaseItemService>();
        services.AddScoped<IChildService<ServiceWaiver, ServiceWaiverResponseDto, CreateServiceWaiverDto>, ServiceWaiverService>();
        services.AddScoped<IChildService<ServiceWaiverCase, ServiceWaiverCaseResponseDto, CreateServiceWaiverCaseDto>, ServiceWaiverCaseService>();
        services.AddScoped<IChildService<ServiceWaiverCaseItem, ServiceWaiverCaseItemResponseDto, CreateServiceWaiverCaseItemDto>, ServiceWaiverCaseItemService>();
        services.AddScoped<IChildService<ServiceTerm, ServiceTermResponseDto, CreateServiceTermDto>, ServiceTermService>();
        services.AddScoped<IChildService<ServiceTermItem, ServiceTermItemResponseDto, CreateServiceTermItemDto>, ServiceTermItemService>();
        services.AddScoped<IChildService<ServiceDeliverable, ServiceDeliverableResponseDto, CreateServiceDeliverableDto>, ServiceDeliverableService>();
        return services;
    }

    public static IServiceCollection AddBillingServices(this IServiceCollection services)
    {
        services.AddScoped<IInvoiceService, InvoiceService>();
        services.AddScoped<IPromoCodeService, PromoCodeService>();
        services.AddScoped<IChildService<Payment, PaymentResponseDto, CreatePaymentDto>, PaymentService>();
        services.AddScoped<IChildService<Refund, RefundResponseDto, CreateRefundDto>, RefundService>();
        return services;
    }

    public static IServiceCollection AddCustomerSupportServices(this IServiceCollection services)
    {
        services.AddScoped<ICampaignService, CampaignService>();
        services.AddScoped<IConversationService, ConversationService>();
        services.AddScoped<IFeedbackService, FeedbackService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ITicketService, TicketService>();
        services.AddScoped<IChildService<CampaignTarget, CampaignTargetResponseDto, CreateCampaignTargetDto>, CampaignTargetService>();
        services.AddScoped<IChildService<Message, MessageResponseDto, CreateMessageDto>, MessageService>();
        services.AddScoped<IChildService<TicketReply, TicketReplyResponseDto, CreateTicketReplyDto>, TicketReplyService>();
        return services;
    }

    public static IServiceCollection AddCustomerDeviceServices(this IServiceCollection services)
    {
        services.AddScoped<ICustomerDeviceService, CustomerDeviceService>();
        services.AddScoped<IDeviceBrandService, DeviceBrandService>();
        services.AddScoped<IDeviceModelService, DeviceModelService>();
        services.AddScoped<IDeviceTypeService, DeviceTypeService>();
        return services;
    }

    public static IServiceCollection AddInquiryServices(this IServiceCollection services)
    {
        services.AddScoped<IInquiryService, InquiryService>();
        services.AddScoped<IDiagnosisCatalogService, DiagnosisCatalogService>();
        services.AddScoped<IInquiryTechnicalDetailService, InquiryTechnicalDetailService>();
        services.AddScoped<IChildService<InquiryItem, InquiryItemResponseDto, CreateInquiryItemDto>, InquiryItemService>();
        services.AddScoped<IChildService<InquiryTechnicalDetail, InquiryTechnicalDetailResponseDto, CreateInquiryTechnicalDetailDto>, InquiryTechnicalDetailService>();
        services.AddScoped<IChildService<InquiryDiagnosis, InquiryDiagnosisResponseDto, CreateInquiryDiagnosisDto>, InquiryDiagnosisService>();
        return services;
    }

    public static IServiceCollection AddJobOrderServices(this IServiceCollection services)
    {
        services.AddScoped<IJobOrderService, JobOrderService>();
        services.AddScoped<IChildService<JobOrderPart, JobOrderPartResponseDto, CreateJobOrderPartDto>, JobOrderPartService>();
        services.AddScoped<IChildService<JobOrderReport, JobOrderReportResponseDto, CreateJobOrderReportDto>, JobOrderReportService>();
        return services;
    }

    public static IServiceCollection AddQuotationServices(this IServiceCollection services)
    {
        services.AddScoped<IQuotationService, QuotationService>();
        services.AddScoped<IServiceAgreementService, ServiceAgreementService>();
        services.AddScoped<IChildService<QuotationItem, QuotationItemResponseDto, CreateQuotationItemDto>, QuotationItemService>();
        services.AddScoped<IChildService<QuotationDetail, QuotationDetailResponseDto, CreateQuotationDetailDto>, QuotationDetailService>();
        services.AddScoped<IChildService<QuotationDeliverable, QuotationDeliverableResponseDto, CreateQuotationDeliverableDto>, QuotationDeliverableService>();
        services.AddScoped<IChildService<QuotationScope, QuotationScopeResponseDto, CreateQuotationScopeDto>, QuotationScopeService>();
        services.AddScoped<IChildService<QuotationScopeCase, QuotationScopeCaseResponseDto, CreateQuotationScopeCaseDto>, QuotationScopeCaseService>();
        services.AddScoped<IChildService<QuotationScopeCaseItem, QuotationScopeCaseItemResponseDto, CreateQuotationScopeCaseItemDto>, QuotationScopeCaseItemService>();
        services.AddScoped<IChildService<QuotationTerm, QuotationTermResponseDto, CreateQuotationTermDto>, QuotationTermService>();
        services.AddScoped<IChildService<QuotationTermItem, QuotationTermItemResponseDto, CreateQuotationTermItemDto>, QuotationTermItemService>();
        services.AddScoped<IChildService<QuotationWaiver, QuotationWaiverResponseDto, CreateQuotationWaiverDto>, QuotationWaiverService>();
        services.AddScoped<IChildService<QuotationWaiverCase, QuotationWaiverCaseResponseDto, CreateQuotationWaiverCaseDto>, QuotationWaiverCaseService>();
        services.AddScoped<IChildService<QuotationWaiverCaseItem, QuotationWaiverCaseItemResponseDto, CreateQuotationWaiverCaseItemDto>, QuotationWaiverCaseItemService>();
        return services;
    }

    public static IServiceCollection AddUserServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<ITechnicianService, TechnicianService>();
        return services;
    }
}