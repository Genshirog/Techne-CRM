using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConnectingCustomerCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TagId1",
                table: "CustomerTags",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerId1",
                table: "CustomerNotes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerId1",
                table: "CustomerContacts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerId1",
                table: "CustomerAddresses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerTags_TagId1",
                table: "CustomerTags",
                column: "TagId1");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerNotes_CustomerId1",
                table: "CustomerNotes",
                column: "CustomerId1");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerContacts_CustomerId1",
                table: "CustomerContacts",
                column: "CustomerId1");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_CustomerId1",
                table: "CustomerAddresses",
                column: "CustomerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId1",
                table: "CustomerAddresses",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerContacts_Customers_CustomerId1",
                table: "CustomerContacts",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerNotes_Customers_CustomerId1",
                table: "CustomerNotes",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerTags_Tags_TagId1",
                table: "CustomerTags",
                column: "TagId1",
                principalTable: "Tags",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerId1",
                table: "CustomerAddresses");

            migrationBuilder.DropForeignKey(
                name: "FK_CustomerContacts_Customers_CustomerId1",
                table: "CustomerContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_CustomerNotes_Customers_CustomerId1",
                table: "CustomerNotes");

            migrationBuilder.DropForeignKey(
                name: "FK_CustomerTags_Tags_TagId1",
                table: "CustomerTags");

            migrationBuilder.DropIndex(
                name: "IX_CustomerTags_TagId1",
                table: "CustomerTags");

            migrationBuilder.DropIndex(
                name: "IX_CustomerNotes_CustomerId1",
                table: "CustomerNotes");

            migrationBuilder.DropIndex(
                name: "IX_CustomerContacts_CustomerId1",
                table: "CustomerContacts");

            migrationBuilder.DropIndex(
                name: "IX_CustomerAddresses_CustomerId1",
                table: "CustomerAddresses");

            migrationBuilder.DropColumn(
                name: "TagId1",
                table: "CustomerTags");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "CustomerNotes");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "CustomerContacts");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "CustomerAddresses");
        }
    }
}
