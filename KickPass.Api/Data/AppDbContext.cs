using KickPass.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KickPass.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<PlayerProfile> PlayerProfiles { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<MatchPlayer> MatchPlayers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PlayerProfile>()
            .HasOne(pp => pp.User)
            .WithOne()
            .HasForeignKey<PlayerProfile>(pp => pp.UserId);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Coach)
            .WithMany()
            .HasForeignKey(m => m.CoachId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MatchPlayer>()
            .HasOne(mp => mp.Match)
            .WithMany(m => m.MatchPlayers)
            .HasForeignKey(mp => mp.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchPlayer>()
            .HasOne(mp => mp.PlayerProfile)
            .WithMany(pp => pp.MatchPlayers)
            .HasForeignKey(mp => mp.PlayerProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MatchPlayer>()
            .ToTable(table =>
                table.HasCheckConstraint(
                    "CK_MatchPlayers_RatingOutOfTen",
                    "[RatingOutOfTen] >= 1 AND [RatingOutOfTen] <= 10"));
    }
}
