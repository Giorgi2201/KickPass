namespace KickPass.Api.Models;

public class SquadMember
{
    public int Id { get; set; }
    public int ClubId { get; set; }
    public Club Club { get; set; } = null!;
    public int PlayerProfileId { get; set; }
    public PlayerProfile PlayerProfile { get; set; } = null!;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}
