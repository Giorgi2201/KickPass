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
    public DbSet<Club> Clubs { get; set; }
    public DbSet<SquadMember> SquadMembers { get; set; }
    public DbSet<Message> Messages { get; set; }

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

        modelBuilder.Entity<Club>()
            .HasOne(c => c.Coach)
            .WithOne()
            .HasForeignKey<Club>(c => c.CoachId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Club>()
            .Property(c => c.Name)
            .HasMaxLength(100);

        modelBuilder.Entity<Club>()
            .Property(c => c.City)
            .HasMaxLength(100);

        modelBuilder.Entity<Club>()
            .Property(c => c.Description)
            .HasMaxLength(500);

        modelBuilder.Entity<Club>()
            .Property(c => c.LogoUrl)
            .HasMaxLength(500);

        modelBuilder.Entity<Club>()
            .HasIndex(c => c.CoachId)
            .IsUnique();

        modelBuilder.Entity<SquadMember>()
            .HasIndex(sm => new { sm.ClubId, sm.PlayerProfileId })
            .IsUnique();

        modelBuilder.Entity<SquadMember>()
            .HasOne(sm => sm.Club)
            .WithMany(c => c.SquadMembers)
            .HasForeignKey(sm => sm.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SquadMember>()
            .HasOne(sm => sm.PlayerProfile)
            .WithMany(pp => pp.SquadMembers)
            .HasForeignKey(sm => sm.PlayerProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Club)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .Property(m => m.Content)
            .HasMaxLength(1000);
    }
}
