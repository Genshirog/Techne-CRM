using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuotationScopeCases_ServiceScopes_ServiceScopeId",
                table: "QuotationScopeCases");

            migrationBuilder.RenameColumn(
                name: "ServiceScopeId",
                table: "QuotationScopeCases",
                newName: "ServiceScopeCaseId");

            migrationBuilder.RenameIndex(
                name: "IX_QuotationScopeCases_ServiceScopeId",
                table: "QuotationScopeCases",
                newName: "IX_QuotationScopeCases_ServiceScopeCaseId");

            migrationBuilder.RenameColumn(
                name: "ExpectedFinshedDate",
                table: "JobOrders",
                newName: "ExpectedFinishedDate");

            migrationBuilder.RenameColumn(
                name: "BalananceDue",
                table: "Invoices",
                newName: "BalanceDue");

            migrationBuilder.AddForeignKey(
                name: "FK_QuotationScopeCases_ServiceScopeCases_ServiceScopeCaseId",
                table: "QuotationScopeCases",
                column: "ServiceScopeCaseId",
                principalTable: "ServiceScopeCases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuotationScopeCases_ServiceScopeCases_ServiceScopeCaseId",
                table: "QuotationScopeCases");

            migrationBuilder.RenameColumn(
                name: "ServiceScopeCaseId",
                table: "QuotationScopeCases",
                newName: "ServiceScopeId");

            migrationBuilder.RenameIndex(
                name: "IX_QuotationScopeCases_ServiceScopeCaseId",
                table: "QuotationScopeCases",
                newName: "IX_QuotationScopeCases_ServiceScopeId");

            migrationBuilder.RenameColumn(
                name: "ExpectedFinishedDate",
                table: "JobOrders",
                newName: "ExpectedFinshedDate");

            migrationBuilder.RenameColumn(
                name: "BalanceDue",
                table: "Invoices",
                newName: "BalananceDue");

            migrationBuilder.AddForeignKey(
                name: "FK_QuotationScopeCases_ServiceScopes_ServiceScopeId",
                table: "QuotationScopeCases",
                column: "ServiceScopeId",
                principalTable: "ServiceScopes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
