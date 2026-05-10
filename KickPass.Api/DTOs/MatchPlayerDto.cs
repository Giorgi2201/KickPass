using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class MatchPlayerDto
{
    [Required]
    public int PlayerProfileId { get; set; }

    [Range(0, 99)]
    public int Goals { get; set; }

    [Range(0, 99)]
    public int Assists { get; set; }

    public bool YellowCard { get; set; }
    public bool RedCard { get; set; }

    [Range(0, 120)]
    public int MinutesPlayed { get; set; }

    [Range(1, 10)]
    public int RatingOutOfTen { get; set; }
}
