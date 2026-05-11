using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class SendMessageDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;
}
