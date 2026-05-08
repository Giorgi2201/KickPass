namespace KickPass.Api.Models;

public class PlayerProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Position { get; set; } = string.Empty;
    public string DominantFoot { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? HighlightUrl { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<MatchPlayer> MatchPlayers { get; set; } = new List<MatchPlayer>();
}
