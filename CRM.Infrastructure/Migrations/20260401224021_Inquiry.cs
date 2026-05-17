using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Inquiry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiagnosisCatalogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiagnosisCatalogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Inquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    GuestId = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inquiries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inquiries_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Inquiries_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Inquiries_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InquiryItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InquiryId = table.Column<int>(type: "int", nullable: false),
                    ServiceCategoryId = table.Column<int>(type: "int", nullable: false),
                    PreferredDate = table.Column<DateOnly>(type: "date", nullable: false),
                    PreferredTime = table.Column<TimeOnly>(type: "time(6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InquiryItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InquiryItems_Inquiries_InquiryId",
                        column: x => x.InquiryId,
                        principalTable: "Inquiries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InquiryItems_ServiceCategories_ServiceCategoryId",
                        column: x => x.ServiceCategoryId,
                        principalTable: "ServiceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InquiryTechnicalDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InquryItemId = table.Column<int>(type: "int", nullable: false),
                    CustomerDeviceId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InquiryTechnicalDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InquiryTechnicalDetails_CustomerDevices_CustomerDeviceId",
                        column: x => x.CustomerDeviceId,
                        principalTable: "CustomerDevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InquiryTechnicalDetails_InquiryItems_InquryItemId",
                        column: x => x.InquryItemId,
                        principalTable: "InquiryItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "InquiryDiagnoses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InquiryTechnicalDetailId = table.Column<int>(type: "int", nullable: false),
                    DiagnosisCatalogId = table.Column<int>(type: "int", nullable: true),
                    CustomDiagnosis = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InquiryDiagnoses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InquiryDiagnoses_DiagnosisCatalogs_DiagnosisCatalogId",
                        column: x => x.DiagnosisCatalogId,
                        principalTable: "DiagnosisCatalogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InquiryDiagnoses_InquiryTechnicalDetails_InquiryTechnicalDet~",
                        column: x => x.InquiryTechnicalDetailId,
                        principalTable: "InquiryTechnicalDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_CompanyId",
                table: "Inquiries",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_CustomerId",
                table: "Inquiries",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_GuestId",
                table: "Inquiries",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryDiagnoses_DiagnosisCatalogId",
                table: "InquiryDiagnoses",
                column: "DiagnosisCatalogId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryDiagnoses_InquiryTechnicalDetailId",
                table: "InquiryDiagnoses",
                column: "InquiryTechnicalDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryItems_InquiryId",
                table: "InquiryItems",
                column: "InquiryId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryItems_ServiceCategoryId",
                table: "InquiryItems",
                column: "ServiceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryTechnicalDetails_CustomerDeviceId",
                table: "InquiryTechnicalDetails",
                column: "CustomerDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryTechnicalDetails_InquryItemId",
                table: "InquiryTechnicalDetails",
                column: "InquryItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InquiryDiagnoses");

            migrationBuilder.DropTable(
                name: "DiagnosisCatalogs");

            migrationBuilder.DropTable(
                name: "InquiryTechnicalDetails");

            migrationBuilder.DropTable(
                name: "InquiryItems");

            migrationBuilder.DropTable(
                name: "Inquiries");
        }
    }
}
