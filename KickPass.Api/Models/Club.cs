namespace KickPass.Api.Models;

public class Club
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public int CoachId { get; set; }
    public User Coach { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<SquadMember> SquadMembers { get; set; } = new List<SquadMember>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
