using System.ComponentModel.DataAnnotations;

namespace KickPass.Api.DTOs;

public class AddSquadMemberDto
{
    [Required]
    public int PlayerProfileId { get; set; }
}
