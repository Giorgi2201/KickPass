namespace KickPass.Api.DTOs;

public class MatchPlayerDto
{
    public int PlayerProfileId { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public bool YellowCard { get; set; }
    public bool RedCard { get; set; }
    public int MinutesPlayed { get; set; }
    public int RatingOutOfTen { get; set; }
}
