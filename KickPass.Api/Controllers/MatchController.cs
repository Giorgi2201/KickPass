using System.Security.Claims;
using KickPass.Api.Data;
using KickPass.Api.DTOs;
using KickPass.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KickPass.Api.Controllers;

[ApiController]
[Route("api/matches")]
[Authorize]
public class MatchController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatchController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> CreateMatch([FromBody] MatchDto dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var coachId))
        {
            return Unauthorized();
        }

        var match = new Match
        {
            CoachId = coachId,
            HomeTeam = dto.HomeTeam,
            AwayTeam = dto.AwayTeam,
            HomeScore = dto.HomeScore,
            AwayScore = dto.AwayScore,
            MatchDate = dto.MatchDate,
            Location = dto.Location
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMatchById), new { matchId = match.Id }, match);
    }

    [HttpPost("{matchId:int}/players")]
    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> AddPlayerToMatch(int matchId, [FromBody] MatchPlayerDto dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var coachId))
        {
            return Unauthorized();
        }

        var match = await _context.Matches.FirstOrDefaultAsync(m => m.Id == matchId);

        if (match is null)
        {
            return NotFound();
        }

        if (match.CoachId != coachId)
        {
            return Forbid();
        }

        var playerProfileExists = await _context.PlayerProfiles.AnyAsync(pp => pp.Id == dto.PlayerProfileId);

        if (!playerProfileExists)
        {
            return NotFound();
        }

        var alreadyAdded = await _context.MatchPlayers.AnyAsync(mp =>
            mp.MatchId == matchId && mp.PlayerProfileId == dto.PlayerProfileId);

        if (alreadyAdded)
        {
            return BadRequest(new { message = "Player already added to this match" });
        }

        var matchPlayer = new MatchPlayer
        {
            MatchId = matchId,
            PlayerProfileId = dto.PlayerProfileId,
            Goals = dto.Goals,
            Assists = dto.Assists,
            YellowCard = dto.YellowCard,
            RedCard = dto.RedCard,
            MinutesPlayed = dto.MinutesPlayed,
            RatingOutOfTen = dto.RatingOutOfTen
        };

        _context.MatchPlayers.Add(matchPlayer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMatchById), new { matchId }, matchPlayer);
    }

    [HttpGet("{matchId:int}")]
    public async Task<IActionResult> GetMatchById(int matchId)
    {
        var match = await _context.Matches
            .Include(m => m.Coach)
            .Include(m => m.MatchPlayers)
            .ThenInclude(mp => mp.PlayerProfile)
            .ThenInclude(pp => pp.User)
            .FirstOrDefaultAsync(m => m.Id == matchId);

        if (match is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            id = match.Id,
            coachId = match.CoachId,
            coachName = match.Coach.FullName,
            homeTeam = match.HomeTeam,
            awayTeam = match.AwayTeam,
            homeScore = match.HomeScore,
            awayScore = match.AwayScore,
            matchDate = match.MatchDate,
            location = match.Location,
            players = match.MatchPlayers.Select(mp => new
            {
                fullName = mp.PlayerProfile.User.FullName,
                position = mp.PlayerProfile.Position,
                goals = mp.Goals,
                assists = mp.Assists,
                yellowCard = mp.YellowCard,
                redCard = mp.RedCard,
                minutesPlayed = mp.MinutesPlayed,
                rating = mp.RatingOutOfTen
            })
        });
    }

    [HttpGet("my")]
    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> GetMyMatches()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var coachId))
        {
            return Unauthorized();
        }

        var matches = await _context.Matches
            .Where(m => m.CoachId == coachId)
            .OrderByDescending(m => m.MatchDate)
            .Select(m => new
            {
                id = m.Id,
                homeTeam = m.HomeTeam,
                awayTeam = m.AwayTeam,
                homeScore = m.HomeScore,
                awayScore = m.AwayScore,
                matchDate = m.MatchDate,
                location = m.Location,
                playerCount = m.MatchPlayers.Count
            })
            .ToListAsync();

        return Ok(matches);
    }

    [HttpGet("my/stats")]
    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> GetMyStats()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var coachId))
        {
            return Unauthorized();
        }

        var matchIds = await _context.Matches
            .Where(m => m.CoachId == coachId)
            .Select(m => m.Id)
            .ToListAsync();

        var totalMatches = matchIds.Count;

        var uniquePlayers = await _context.MatchPlayers
            .Where(mp => matchIds.Contains(mp.MatchId))
            .Select(mp => mp.PlayerProfileId)
            .Distinct()
            .CountAsync();

        return Ok(new
        {
            totalMatches,
            uniquePlayers
        });
    }

    [HttpDelete("{matchId:int}")]
    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> DeleteMatch(int matchId)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var coachId))
        {
            return Unauthorized();
        }

        var match = await _context.Matches.FirstOrDefaultAsync(m => m.Id == matchId);

        if (match is null)
        {
            return NotFound();
        }

        if (match.CoachId != coachId)
        {
            return Forbid();
        }

        _context.Matches.Remove(match);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
