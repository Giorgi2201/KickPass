using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class PlayerProfileDto
{
    [Required]
    [MaxLength(50)]
    public string Position { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string DominantFoot { get; set; } = string.Empty;

    [Range(10, 60)]
    public int Age { get; set; }

    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Bio { get; set; }

    [MaxLength(500)]
    public string? HighlightUrl { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }
}
