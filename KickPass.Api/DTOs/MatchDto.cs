using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class MatchDto
{
    [Required]
    [MaxLength(100)]
    public string HomeTeam { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string AwayTeam { get; set; } = string.Empty;

    [Range(0, 99)]
    public int HomeScore { get; set; }

    [Range(0, 99)]
    public int AwayScore { get; set; }

    public DateTime MatchDate { get; set; }
    public string? Location { get; set; }
}
