using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddingTechnicianOnTechnicalDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TechnicianId",
                table: "InquiryTechnicalDetails",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InquiryTechnicalDetails_TechnicianId",
                table: "InquiryTechnicalDetails",
                column: "TechnicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_InquiryTechnicalDetails_Technicians_TechnicianId",
                table: "InquiryTechnicalDetails",
                column: "TechnicianId",
                principalTable: "Technicians",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InquiryTechnicalDetails_Technicians_TechnicianId",
                table: "InquiryTechnicalDetails");

            migrationBuilder.DropIndex(
                name: "IX_InquiryTechnicalDetails_TechnicianId",
                table: "InquiryTechnicalDetails");

            migrationBuilder.DropColumn(
                name: "TechnicianId",
                table: "InquiryTechnicalDetails");
        }
    }
}
