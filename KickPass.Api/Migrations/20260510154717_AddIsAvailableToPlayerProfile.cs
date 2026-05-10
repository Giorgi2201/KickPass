using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KickPass.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsAvailableToPlayerProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "PlayerProfiles",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "PlayerProfiles");
        }
    }
}
