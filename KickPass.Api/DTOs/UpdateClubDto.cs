using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class UpdateClubDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? LogoUrl { get; set; }
}
