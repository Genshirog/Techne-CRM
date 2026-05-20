using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConnectingCustomerCatalog05 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerTags_Tags_TagId1",
                table: "CustomerTags");

            migrationBuilder.DropIndex(
                name: "IX_CustomerTags_TagId1",
                table: "CustomerTags");

            migrationBuilder.DropColumn(
                name: "TagId1",
                table: "CustomerTags");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TagId1",
                table: "CustomerTags",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerTags_TagId1",
                table: "CustomerTags",
                column: "TagId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerTags_Tags_TagId1",
                table: "CustomerTags",
                column: "TagId1",
                principalTable: "Tags",
                principalColumn: "Id");
        }
    }
}
