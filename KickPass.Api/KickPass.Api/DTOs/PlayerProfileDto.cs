namespace KickPass.Api.DTOs;

public class PlayerProfileDto
{
    public string Position { get; set; } = string.Empty;
    public string DominantFoot { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? HighlightUrl { get; set; }
    public string? AvatarUrl { get; set; }
}
