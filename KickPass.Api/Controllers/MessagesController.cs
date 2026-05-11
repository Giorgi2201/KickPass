using System.Security.Claims;
using KickPass.Api.Constants;
using KickPass.Api.Data;
using KickPass.Api.DTOs;
using KickPass.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KickPass.Api.Controllers;

[ApiController]
[Route("api/clubs/{clubId}/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MessagesController(AppDbContext context)
    {
        _context = context;
    }

    private async Task<bool> IsUserAuthorizedForClubChat(int clubId, int userId, string userRole)
    {
        var club = await _context.Clubs
            .Include(c => c.SquadMembers)
            .ThenInclude(sm => sm.PlayerProfile)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club == null) return false;

        // Coach authorization: Must be the owner of this club
        if (userRole == Roles.Coach && club.CoachId == userId) return true;

        // Player authorization: Must be in the SquadMembers list of this club
        if (userRole == Roles.Player && club.SquadMembers.Any(sm => sm.PlayerProfile.UserId == userId)) return true;

        return false;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages(int clubId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (userRole == null)
        {
            return Unauthorized();
        }

        if (!await IsUserAuthorizedForClubChat(clubId, userId, userRole))
        {
            return Forbid();
        }

        var messages = await _context.Messages
            .Include(m => m.Sender)
            .Where(m => m.ClubId == clubId)
            .OrderBy(m => m.SentAt)
            .Take(100)
            .ToListAsync();

        var messageDtos = messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ClubId = m.ClubId,
            SenderId = m.SenderId,
            SenderName = m.Sender.FullName,
            SenderRole = m.Sender.Role,
            Content = m.IsDeleted ? "This message was deleted." : m.Content,
            SentAt = m.SentAt,
            IsDeleted = m.IsDeleted
        }).ToList();

        return Ok(messageDtos);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(int clubId, SendMessageDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (userRole == null)
        {
            return Unauthorized();
        }

        if (!await IsUserAuthorizedForClubChat(clubId, userId, userRole))
        {
            return Forbid();
        }

        var message = new Message
        {
            ClubId = clubId,
            SenderId = userId,
            Content = dto.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        await _context.Entry(message)
            .Reference(m => m.Sender)
            .LoadAsync();

        var messageDto = new MessageDto
        {
            Id = message.Id,
            ClubId = message.ClubId,
            SenderId = message.SenderId,
            SenderName = message.Sender.FullName,
            SenderRole = message.Sender.Role,
            Content = message.Content,
            SentAt = message.SentAt,
            IsDeleted = message.IsDeleted
        };

        return Ok(messageDto);
    }

    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(int clubId, int messageId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var message = await _context.Messages
            .Include(m => m.Club)
            .FirstOrDefaultAsync(m => m.Id == messageId && m.ClubId == clubId);

        if (message == null)
        {
            return NotFound();
        }

        // Only the original sender OR the coach of the club can delete
        if (message.SenderId != userId && message.Club.CoachId != userId)
        {
            return Forbid();
        }

        message.IsDeleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
