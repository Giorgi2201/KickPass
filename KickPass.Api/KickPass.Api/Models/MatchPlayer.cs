namespace KickPass.Api.Models;

public class MatchPlayer
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public Match Match { get; set; } = null!;
    public int PlayerProfileId { get; set; }
    public PlayerProfile PlayerProfile { get; set; } = null!;
    public int Goals { get; set; } = 0;
    public int Assists { get; set; } = 0;
    public bool YellowCard { get; set; } = false;
    public bool RedCard { get; set; } = false;
    public int MinutesPlayed { get; set; } = 90;
    public int RatingOutOfTen { get; set; }
}
