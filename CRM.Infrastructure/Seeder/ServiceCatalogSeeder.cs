using CRM.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Seeders;

public static class ServiceCatalogSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.ServiceCategories.Any()) return; // guard — skip if already seeded

        // ──────────────────────────────────────────────────────────────────────
        // 1. CATEGORIES
        // ──────────────────────────────────────────────────────────────────────

        var catTechnical    = new ServiceCategory { Name = "Computer & Laptop Repair", Type = ServiceCategoryType.Technical };
        var catNetworking   = new ServiceCategory { Name = "Networking & Connectivity",  Type = ServiceCategoryType.Technical };
        var catConstruction = new ServiceCategory { Name = "Electrical & Wiring",        Type = ServiceCategoryType.Construction };
        var catGeneral      = new ServiceCategory { Name = "General Maintenance",         Type = ServiceCategoryType.General };

        context.ServiceCategories.AddRange(catTechnical, catNetworking, catConstruction, catGeneral);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 2. SERVICES
        // ──────────────────────────────────────────────────────────────────────

        var svcLaptopRepair = new Service
        {
            ServiceCategoryId = catTechnical.Id,
            Name        = "Laptop Repair",
            Description = "Full diagnosis and repair of laptop hardware and software issues including screen, keyboard, motherboard, and storage.",
        };

        var svcDataRecovery = new Service
        {
            ServiceCategoryId = catTechnical.Id,
            Name        = "Data Recovery",
            Description = "Recovery of lost, deleted, or corrupted data from hard drives, SSDs, and USB storage devices.",
        };

        var svcNetworkSetup = new Service
        {
            ServiceCategoryId = catNetworking.Id,
            Name        = "Network Setup & Configuration",
            Description = "Installation and configuration of routers, switches, access points, and LAN/WAN infrastructure.",
        };

        var svcElectrical = new Service
        {
            ServiceCategoryId = catConstruction.Id,
            Name        = "Electrical Panel Installation",
            Description = "Installation, upgrade, and troubleshooting of residential and commercial electrical panels.",
        };

        var svcPreventive = new Service
        {
            ServiceCategoryId = catGeneral.Id,
            Name        = "Preventive Maintenance",
            Description = "Scheduled cleaning, inspection, and tune-up of devices and equipment to prevent failure.",
        };

        context.Services.AddRange(svcLaptopRepair, svcDataRecovery, svcNetworkSetup, svcElectrical, svcPreventive);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 3. SCOPES  (ServiceScope → ServiceScopeCase → ServiceScopeCaseItem)
        // ──────────────────────────────────────────────────────────────────────

        var scopes = new List<ServiceScope>
        {
            // Laptop Repair — Hardware Inspection
            new ServiceScope
            {
                ServiceId = svcLaptopRepair.Id,
                Title     = "Hardware Inspection",
                Order     = 1,
                ServiceScopeCases = new List<ServiceScopeCase>
                {
                    new ServiceScopeCase
                    {
                        Title = "Visual & Physical Check",
                        Order = 1,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Inspect chassis for cracks, dents, and physical damage.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Check all ports (USB, HDMI, charging) for damage or debris.", Order = 2 },
                            new ServiceScopeCaseItem { Content = "Verify screen integrity — dead pixels, backlight bleed, hinge condition.", Order = 3 },
                        }
                    },
                    new ServiceScopeCase
                    {
                        Title = "Thermal & Performance Scan",
                        Order = 2,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Record CPU and GPU temperatures under idle and load.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Check fan operation and airflow pathways.", Order = 2 },
                            new ServiceScopeCaseItem { Content = "Run memory (RAM) diagnostic test.", Order = 3 },
                        }
                    },
                }
            },

            // Laptop Repair — Software Diagnostics
            new ServiceScope
            {
                ServiceId = svcLaptopRepair.Id,
                Title     = "Software Diagnostics",
                Order     = 2,
                ServiceScopeCases = new List<ServiceScopeCase>
                {
                    new ServiceScopeCase
                    {
                        Title = "OS & Driver Check",
                        Order = 1,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Verify OS integrity and check for corrupted system files.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Update or reinstall missing/outdated drivers.", Order = 2 },
                        }
                    },
                }
            },

            // Data Recovery — Storage Assessment
            new ServiceScope
            {
                ServiceId = svcDataRecovery.Id,
                Title     = "Storage Device Assessment",
                Order     = 1,
                ServiceScopeCases = new List<ServiceScopeCase>
                {
                    new ServiceScopeCase
                    {
                        Title = "Drive Health Check",
                        Order = 1,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Run S.M.A.R.T. analysis to determine drive health.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Identify bad sectors and read/write failure zones.", Order = 2 },
                        }
                    },
                    new ServiceScopeCase
                    {
                        Title = "Recovery Attempt",
                        Order = 2,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Perform logical recovery using professional data recovery software.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Document recoverable files and present to client before transfer.", Order = 2 },
                        }
                    },
                }
            },

            // Network Setup — Site Survey
            new ServiceScope
            {
                ServiceId = svcNetworkSetup.Id,
                Title     = "Site Survey & Planning",
                Order     = 1,
                ServiceScopeCases = new List<ServiceScopeCase>
                {
                    new ServiceScopeCase
                    {
                        Title = "Coverage Assessment",
                        Order = 1,
                        ServiceScopeCaseItems = new List<ServiceScopeCaseItem>
                        {
                            new ServiceScopeCaseItem { Content = "Map floor plan and identify dead zones.", Order = 1 },
                            new ServiceScopeCaseItem { Content = "Determine optimal access point placement for full coverage.", Order = 2 },
                        }
                    },
                }
            },
        };

        context.ServiceScopes.AddRange(scopes);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 4. WAIVERS  (ServiceWaiver → ServiceWaiverCase → ServiceWaiverCaseItem)
        // ──────────────────────────────────────────────────────────────────────

        var waivers = new List<ServiceWaiver>
        {
            new ServiceWaiver
            {
                ServiceId = svcLaptopRepair.Id,
                Title     = "Pre-existing Damage",
                Order     = 1,
                Cases     = new List<ServiceWaiverCase>
                {
                    new ServiceWaiverCase
                    {
                        Title = "Cosmetic Damage",
                        Order = 1,
                        ServiceWaiverCaseItems = new List<ServiceWaiverCaseItem>
                        {
                            new ServiceWaiverCaseItem { Content = "Service provider is not liable for pre-existing cosmetic damage (scratches, dents, discoloration).", Order = 1 },
                        }
                    },
                    new ServiceWaiverCase
                    {
                        Title = "Data Loss",
                        Order = 2,
                        ServiceWaiverCaseItems = new List<ServiceWaiverCaseItem>
                        {
                            new ServiceWaiverCaseItem { Content = "Client is advised to back up all data before service. Provider is not responsible for data loss during hardware repair.", Order = 1 },
                        }
                    },
                }
            },

            new ServiceWaiver
            {
                ServiceId = svcDataRecovery.Id,
                Title     = "Recovery Success Disclaimer",
                Order     = 1,
                Cases     = new List<ServiceWaiverCase>
                {
                    new ServiceWaiverCase
                    {
                        Title = "No Guarantee of Full Recovery",
                        Order = 1,
                        ServiceWaiverCaseItems = new List<ServiceWaiverCaseItem>
                        {
                            new ServiceWaiverCaseItem { Content = "Recovery success depends on the extent of physical and logical damage. Partial recovery is still billable.", Order = 1 },
                            new ServiceWaiverCaseItem { Content = "Service provider shall not be held liable for permanently unrecoverable data.", Order = 2 },
                        }
                    },
                }
            },

            new ServiceWaiver
            {
                ServiceId = svcElectrical.Id,
                Title     = "Safety & Compliance",
                Order     = 1,
                Cases     = new List<ServiceWaiverCase>
                {
                    new ServiceWaiverCase
                    {
                        Title = "Permit Responsibility",
                        Order = 1,
                        ServiceWaiverCaseItems = new List<ServiceWaiverCaseItem>
                        {
                            new ServiceWaiverCaseItem { Content = "Client is responsible for securing necessary building and electrical permits prior to installation.", Order = 1 },
                        }
                    },
                }
            },
        };

        context.ServiceWaivers.AddRange(waivers);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 5. TERMS  (ServiceTerm → ServiceTermItem)
        // ──────────────────────────────────────────────────────────────────────

        var terms = new List<ServiceTerm>
        {
            new ServiceTerm
            {
                ServiceId = svcLaptopRepair.Id,
                Title     = "Payment Terms",
                Order     = 1,
                Items     = new List<ServiceTermItem>
                {
                    new ServiceTermItem { Content = "50% downpayment is required before repair commences.", Order = 1 },
                    new ServiceTermItem { Content = "Remaining balance is due upon device release.", Order = 2 },
                    new ServiceTermItem { Content = "Accepted payment methods: Cash, GCash, Maya.", Order = 3 },
                }
            },
            new ServiceTerm
            {
                ServiceId = svcLaptopRepair.Id,
                Title     = "Warranty",
                Order     = 2,
                Items     = new List<ServiceTermItem>
                {
                    new ServiceTermItem { Content = "Parts replaced carry a 30-day warranty from date of release.", Order = 1 },
                    new ServiceTermItem { Content = "Labor warranty is 15 days. Warranty is void if the unit is tampered with by a third party.", Order = 2 },
                }
            },
            new ServiceTerm
            {
                ServiceId = svcDataRecovery.Id,
                Title     = "Payment Terms",
                Order     = 1,
                Items     = new List<ServiceTermItem>
                {
                    new ServiceTermItem { Content = "Diagnostic fee is collected upfront and is non-refundable.", Order = 1 },
                    new ServiceTermItem { Content = "Full recovery fee is due upon successful data transfer to client's chosen media.", Order = 2 },
                }
            },
            new ServiceTerm
            {
                ServiceId = svcNetworkSetup.Id,
                Title     = "Service Coverage",
                Order     = 1,
                Items     = new List<ServiceTermItem>
                {
                    new ServiceTermItem { Content = "Quotation covers labor and materials specified only. Additional cabling or hardware will be quoted separately.", Order = 1 },
                    new ServiceTermItem { Content = "ISP coordination (if required) is the responsibility of the client.", Order = 2 },
                }
            },
        };

        context.ServiceTerms.AddRange(terms);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 6. DELIVERABLES
        // ──────────────────────────────────────────────────────────────────────

        var deliverables = new List<ServiceDeliverable>
        {
            // Laptop Repair
            new ServiceDeliverable { ServiceId = svcLaptopRepair.Id, Content = "Fully repaired and tested unit returned to client.",              Order = 1 },
            new ServiceDeliverable { ServiceId = svcLaptopRepair.Id, Content = "Diagnostic report summarizing findings and parts replaced.",       Order = 2 },
            new ServiceDeliverable { ServiceId = svcLaptopRepair.Id, Content = "Warranty certificate issued for parts and labor.",                 Order = 3 },

            // Data Recovery
            new ServiceDeliverable { ServiceId = svcDataRecovery.Id, Content = "Recovered files transferred to client-provided external storage.", Order = 1 },
            new ServiceDeliverable { ServiceId = svcDataRecovery.Id, Content = "Recovery report listing all retrieved files and their status.",    Order = 2 },

            // Network Setup
            new ServiceDeliverable { ServiceId = svcNetworkSetup.Id, Content = "Fully configured network with documented IP scheme.",              Order = 1 },
            new ServiceDeliverable { ServiceId = svcNetworkSetup.Id, Content = "Network diagram provided to client.",                             Order = 2 },
            new ServiceDeliverable { ServiceId = svcNetworkSetup.Id, Content = "On-site walkthrough and handover to client.",                     Order = 3 },

            // Electrical
            new ServiceDeliverable { ServiceId = svcElectrical.Id, Content = "Installed and tested electrical panel.",                           Order = 1 },
            new ServiceDeliverable { ServiceId = svcElectrical.Id, Content = "Completion report with circuit labeling diagram.",                  Order = 2 },

            // Preventive Maintenance
            new ServiceDeliverable { ServiceId = svcPreventive.Id, Content = "Cleaned and inspected device/equipment.",                          Order = 1 },
            new ServiceDeliverable { ServiceId = svcPreventive.Id, Content = "Maintenance checklist signed by technician.",                      Order = 2 },
        };

        context.ServiceDeliverables.AddRange(deliverables);
        context.SaveChanges();
    }
}