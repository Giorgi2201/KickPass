namespace KickPass.Api.Models;

public class Message
{
    public int Id { get; set; }
    public int ClubId { get; set; }
    public Club Club { get; set; } = null!;
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
}
