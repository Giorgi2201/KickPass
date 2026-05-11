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
[Route("api/clubs")]
public class ClubController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClubController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> CreateClub(CreateClubDto dto)
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var existingClub = await _context.Clubs.AnyAsync(c => c.CoachId == coachId);
        if (existingClub)
        {
            return BadRequest(new { message = "You already have a club. A coach can only manage one club." });
        }

        var club = new Club
        {
            Name = dto.Name,
            City = dto.City,
            Description = dto.Description,
            LogoUrl = dto.LogoUrl,
            CoachId = coachId.Value
        };

        _context.Clubs.Add(club);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyClub), new { }, new
        {
            id = club.Id,
            name = club.Name,
            city = club.City,
            description = club.Description,
            logoUrl = club.LogoUrl,
            coachId = club.CoachId,
            createdAt = club.CreatedAt,
            squadCount = 0
        });
    }

    [HttpGet("my")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> GetMyClub()
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var club = await _context.Clubs
            .Include(c => c.SquadMembers)
            .ThenInclude(sm => sm.PlayerProfile)
            .ThenInclude(pp => pp.User)
            .FirstOrDefaultAsync(c => c.CoachId == coachId);

        if (club is null)
        {
            return NotFound(new { message = "You have not created a club yet." });
        }

        return Ok(new
        {
            id = club.Id,
            name = club.Name,
            city = club.City,
            description = club.Description,
            logoUrl = club.LogoUrl,
            createdAt = club.CreatedAt,
            squadCount = club.SquadMembers.Count,
            squad = club.SquadMembers.Select(sm => new
            {
                squadMemberId = sm.Id,
                playerProfileId = sm.PlayerProfile.Id,
                userId = sm.PlayerProfile.UserId,
                fullName = sm.PlayerProfile.User.FullName,
                position = sm.PlayerProfile.Position,
                dominantFoot = sm.PlayerProfile.DominantFoot,
                age = sm.PlayerProfile.Age,
                city = sm.PlayerProfile.City,
                country = sm.PlayerProfile.Country,
                avatarUrl = sm.PlayerProfile.AvatarUrl,
                isAvailable = sm.PlayerProfile.IsAvailable,
                joinedAt = sm.JoinedAt
            }).OrderBy(s => s.fullName).ToList()
        });
    }

    [HttpPut("my")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> UpdateClub(UpdateClubDto dto)
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var club = await _context.Clubs.FirstOrDefaultAsync(c => c.CoachId == coachId);
        if (club is null)
        {
            return NotFound(new { message = "You have not created a club yet." });
        }

        club.Name = dto.Name;
        club.City = dto.City;
        club.Description = dto.Description;
        club.LogoUrl = dto.LogoUrl;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = club.Id,
            name = club.Name,
            city = club.City,
            description = club.Description,
            logoUrl = club.LogoUrl,
            createdAt = club.CreatedAt
        });
    }

    [HttpPost("my/squad")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> AddSquadMember(AddSquadMemberDto dto)
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var club = await _context.Clubs.FirstOrDefaultAsync(c => c.CoachId == coachId);
        if (club is null)
        {
            return NotFound(new { message = "You have not created a club yet." });
        }

        var playerProfile = await _context.PlayerProfiles
            .Include(pp => pp.User)
            .FirstOrDefaultAsync(pp => pp.Id == dto.PlayerProfileId);

        if (playerProfile is null)
        {
            return NotFound(new { message = "Player profile not found." });
        }

        var alreadyInSquad = await _context.SquadMembers.AnyAsync(sm =>
            sm.ClubId == club.Id && sm.PlayerProfileId == dto.PlayerProfileId);

        if (alreadyInSquad)
        {
            return BadRequest(new { message = "This player is already in your squad." });
        }

        var squadMember = new SquadMember
        {
            ClubId = club.Id,
            PlayerProfileId = dto.PlayerProfileId
        };

        _context.SquadMembers.Add(squadMember);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyClub), new { }, new
        {
            squadMemberId = squadMember.Id,
            playerProfileId = dto.PlayerProfileId,
            fullName = playerProfile.User.FullName,
            position = playerProfile.Position,
            dominantFoot = playerProfile.DominantFoot,
            age = playerProfile.Age,
            city = playerProfile.City,
            country = playerProfile.Country,
            avatarUrl = playerProfile.AvatarUrl,
            joinedAt = squadMember.JoinedAt
        });
    }

    [HttpDelete("my/squad/{squadMemberId}")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> RemoveSquadMember(int squadMemberId)
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var club = await _context.Clubs.FirstOrDefaultAsync(c => c.CoachId == coachId);
        if (club is null)
        {
            return NotFound(new { message = "You have not created a club yet." });
        }

        var squadMember = await _context.SquadMembers
            .FirstOrDefaultAsync(sm => sm.Id == squadMemberId && sm.ClubId == club.Id);

        if (squadMember is null)
        {
            return NotFound(new { message = "Squad member not found." });
        }

        _context.SquadMembers.Remove(squadMember);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("my")]
    [Authorize(Roles = Roles.Coach)]
    public async Task<IActionResult> DeleteClub()
    {
        var coachId = GetCurrentUserId();
        if (coachId is null)
        {
            return Unauthorized();
        }

        var club = await _context.Clubs.FirstOrDefaultAsync(c => c.CoachId == coachId);
        if (club is null)
        {
            return NotFound(new { message = "You have not created a club yet." });
        }

        _context.Clubs.Remove(club);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{clubId}")]
    public async Task<IActionResult> GetClubById(int clubId)
    {
        var club = await _context.Clubs
            .Include(c => c.SquadMembers)
            .ThenInclude(sm => sm.PlayerProfile)
            .ThenInclude(pp => pp.User)
            .FirstOrDefaultAsync(c => c.Id == clubId);

        if (club is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            id = club.Id,
            name = club.Name,
            city = club.City,
            description = club.Description,
            logoUrl = club.LogoUrl,
            createdAt = club.CreatedAt,
            squadCount = club.SquadMembers.Count,
            squad = club.SquadMembers.Select(sm => new
            {
                squadMemberId = sm.Id,
                playerProfileId = sm.PlayerProfile.Id,
                userId = sm.PlayerProfile.UserId,
                fullName = sm.PlayerProfile.User.FullName,
                position = sm.PlayerProfile.Position,
                dominantFoot = sm.PlayerProfile.DominantFoot,
                age = sm.PlayerProfile.Age,
                city = sm.PlayerProfile.City,
                country = sm.PlayerProfile.Country,
                avatarUrl = sm.PlayerProfile.AvatarUrl,
                isAvailable = sm.PlayerProfile.IsAvailable,
                joinedAt = sm.JoinedAt
            }).OrderBy(s => s.fullName).ToList()
        });
    }

    private int? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var id) ? id : null;
    }
}
