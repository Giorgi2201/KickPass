namespace KickPass.Api.Models;

public class Match
{
    public int Id { get; set; }
    public int CoachId { get; set; }
    public User Coach { get; set; } = null!;
    public string HomeTeam { get; set; } = string.Empty;
    public string AwayTeam { get; set; } = string.Empty;
    public int HomeScore { get; set; }
    public int AwayScore { get; set; }
    public DateTime MatchDate { get; set; }
    public string? Location { get; set; }
    public ICollection<MatchPlayer> MatchPlayers { get; set; } = new List<MatchPlayer>();
}
