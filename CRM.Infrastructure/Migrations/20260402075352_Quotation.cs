using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Quotation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchaseTime",
                table: "ServiceWaiverCases");

            migrationBuilder.CreateTable(
                name: "Quotations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InquiryId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    TechnicianId = table.Column<int>(type: "int", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: false),
                    LaborEstimate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PartsEstimate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DiagnosisFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GrandTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Quotations_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Quotations_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quotations_Inquiries_InquiryId",
                        column: x => x.InquiryId,
                        principalTable: "Inquiries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quotations_Technicians_TechnicianId",
                        column: x => x.TechnicianId,
                        principalTable: "Technicians",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quotations_Users_ApprovedBy",
                        column: x => x.ApprovedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationClientSnapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationId = table.Column<int>(type: "int", nullable: false),
                    ClientName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ClientAddress = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ClientEmail = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ClientLogo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationClientSnapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationClientSnapshots_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationItems_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationItems_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationSignatures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationId = table.Column<int>(type: "int", nullable: false),
                    CustomeSignature = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CustomerDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ProviderName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProviderSignature = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProviderDate = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationSignatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationSignatures_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationDeliverables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationItemId = table.Column<int>(type: "int", nullable: false),
                    ServiceDeliverableId = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationDeliverables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationDeliverables_QuotationItems_QuotationItemId",
                        column: x => x.QuotationItemId,
                        principalTable: "QuotationItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationDeliverables_ServiceDeliverables_ServiceDeliverable~",
                        column: x => x.ServiceDeliverableId,
                        principalTable: "ServiceDeliverables",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationItemId = table.Column<int>(type: "int", nullable: false),
                    ItemName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationDetails_QuotationItems_QuotationItemId",
                        column: x => x.QuotationItemId,
                        principalTable: "QuotationItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationScopes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationItemId = table.Column<int>(type: "int", nullable: false),
                    ServiceScopeId = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationScopes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationScopes_QuotationItems_QuotationItemId",
                        column: x => x.QuotationItemId,
                        principalTable: "QuotationItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationScopes_ServiceScopes_ServiceScopeId",
                        column: x => x.ServiceScopeId,
                        principalTable: "ServiceScopes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationTerms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationItemId = table.Column<int>(type: "int", nullable: false),
                    ServiceTermId = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationTerms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationTerms_QuotationItems_QuotationItemId",
                        column: x => x.QuotationItemId,
                        principalTable: "QuotationItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationTerms_ServiceTerms_ServiceTermId",
                        column: x => x.ServiceTermId,
                        principalTable: "ServiceTerms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationWaivers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationItemId = table.Column<int>(type: "int", nullable: false),
                    ServiceWaiverId = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationWaivers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationWaivers_QuotationItems_QuotationItemId",
                        column: x => x.QuotationItemId,
                        principalTable: "QuotationItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationWaivers_ServiceWaivers_ServiceWaiverId",
                        column: x => x.ServiceWaiverId,
                        principalTable: "ServiceWaivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationScopeCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationScopeId = table.Column<int>(type: "int", nullable: false),
                    ServiceScopeId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationScopeCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationScopeCases_QuotationScopes_QuotationScopeId",
                        column: x => x.QuotationScopeId,
                        principalTable: "QuotationScopes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationScopeCases_ServiceScopes_ServiceScopeId",
                        column: x => x.ServiceScopeId,
                        principalTable: "ServiceScopes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationTermItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationTermId = table.Column<int>(type: "int", nullable: false),
                    ServiceTermItemId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationTermItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationTermItems_QuotationTerms_QuotationTermId",
                        column: x => x.QuotationTermId,
                        principalTable: "QuotationTerms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationTermItems_ServiceTermItems_ServiceTermItemId",
                        column: x => x.ServiceTermItemId,
                        principalTable: "ServiceTermItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationWaiverCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationWaiverId = table.Column<int>(type: "int", nullable: false),
                    ServiceWaiverCaseId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationWaiverCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationWaiverCases_QuotationWaivers_QuotationWaiverId",
                        column: x => x.QuotationWaiverId,
                        principalTable: "QuotationWaivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationWaiverCases_ServiceWaiverCases_ServiceWaiverCaseId",
                        column: x => x.ServiceWaiverCaseId,
                        principalTable: "ServiceWaiverCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationScopeCaseItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationScopeCaseId = table.Column<int>(type: "int", nullable: false),
                    ServiceScopeCaseItemId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationScopeCaseItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationScopeCaseItems_QuotationScopeCases_QuotationScopeCa~",
                        column: x => x.QuotationScopeCaseId,
                        principalTable: "QuotationScopeCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationScopeCaseItems_ServiceScopeCaseItems_ServiceScopeCa~",
                        column: x => x.ServiceScopeCaseItemId,
                        principalTable: "ServiceScopeCaseItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "QuotationWaiverCaseItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    QuotationWaiverCaseId = table.Column<int>(type: "int", nullable: false),
                    ServiceWaiverCaseItemId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationWaiverCaseItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationWaiverCaseItems_QuotationWaiverCases_QuotationWaive~",
                        column: x => x.QuotationWaiverCaseId,
                        principalTable: "QuotationWaiverCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationWaiverCaseItems_ServiceWaiverCaseItems_ServiceWaive~",
                        column: x => x.ServiceWaiverCaseItemId,
                        principalTable: "ServiceWaiverCaseItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationClientSnapshots_QuotationId",
                table: "QuotationClientSnapshots",
                column: "QuotationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDeliverables_QuotationItemId",
                table: "QuotationDeliverables",
                column: "QuotationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDeliverables_ServiceDeliverableId",
                table: "QuotationDeliverables",
                column: "ServiceDeliverableId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDetails_QuotationItemId",
                table: "QuotationDetails",
                column: "QuotationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationItems_QuotationId",
                table: "QuotationItems",
                column: "QuotationId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationItems_ServiceId",
                table: "QuotationItems",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_ApprovedBy",
                table: "Quotations",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_CompanyId",
                table: "Quotations",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_CustomerId",
                table: "Quotations",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_InquiryId",
                table: "Quotations",
                column: "InquiryId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_TechnicianId",
                table: "Quotations",
                column: "TechnicianId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopeCaseItems_QuotationScopeCaseId",
                table: "QuotationScopeCaseItems",
                column: "QuotationScopeCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopeCaseItems_ServiceScopeCaseItemId",
                table: "QuotationScopeCaseItems",
                column: "ServiceScopeCaseItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopeCases_QuotationScopeId",
                table: "QuotationScopeCases",
                column: "QuotationScopeId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopeCases_ServiceScopeId",
                table: "QuotationScopeCases",
                column: "ServiceScopeId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopes_QuotationItemId",
                table: "QuotationScopes",
                column: "QuotationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationScopes_ServiceScopeId",
                table: "QuotationScopes",
                column: "ServiceScopeId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationSignatures_QuotationId",
                table: "QuotationSignatures",
                column: "QuotationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuotationTermItems_QuotationTermId",
                table: "QuotationTermItems",
                column: "QuotationTermId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationTermItems_ServiceTermItemId",
                table: "QuotationTermItems",
                column: "ServiceTermItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationTerms_QuotationItemId",
                table: "QuotationTerms",
                column: "QuotationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationTerms_ServiceTermId",
                table: "QuotationTerms",
                column: "ServiceTermId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaiverCaseItems_QuotationWaiverCaseId",
                table: "QuotationWaiverCaseItems",
                column: "QuotationWaiverCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaiverCaseItems_ServiceWaiverCaseItemId",
                table: "QuotationWaiverCaseItems",
                column: "ServiceWaiverCaseItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaiverCases_QuotationWaiverId",
                table: "QuotationWaiverCases",
                column: "QuotationWaiverId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaiverCases_ServiceWaiverCaseId",
                table: "QuotationWaiverCases",
                column: "ServiceWaiverCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaivers_QuotationItemId",
                table: "QuotationWaivers",
                column: "QuotationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationWaivers_ServiceWaiverId",
                table: "QuotationWaivers",
                column: "ServiceWaiverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuotationClientSnapshots");

            migrationBuilder.DropTable(
                name: "QuotationDeliverables");

            migrationBuilder.DropTable(
                name: "QuotationDetails");

            migrationBuilder.DropTable(
                name: "QuotationScopeCaseItems");

            migrationBuilder.DropTable(
                name: "QuotationSignatures");

            migrationBuilder.DropTable(
                name: "QuotationTermItems");

            migrationBuilder.DropTable(
                name: "QuotationWaiverCaseItems");

            migrationBuilder.DropTable(
                name: "QuotationScopeCases");

            migrationBuilder.DropTable(
                name: "QuotationTerms");

            migrationBuilder.DropTable(
                name: "QuotationWaiverCases");

            migrationBuilder.DropTable(
                name: "QuotationScopes");

            migrationBuilder.DropTable(
                name: "QuotationWaivers");

            migrationBuilder.DropTable(
                name: "QuotationItems");

            migrationBuilder.DropTable(
                name: "Quotations");

            migrationBuilder.AddColumn<DateTime>(
                name: "PurchaseTime",
                table: "ServiceWaiverCases",
                type: "datetime(6)",
                nullable: true);
        }
    }
}
