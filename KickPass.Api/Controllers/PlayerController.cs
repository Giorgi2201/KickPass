using System.Security.Claims;
using KickPass.Api.Data;
using KickPass.Api.DTOs;
using KickPass.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KickPass.Api.Controllers;

[ApiController]
[Route("api/players")]
[Authorize]
public class PlayerController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlayerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("profile")]
    [Authorize(Roles = "Player")]
    public async Task<IActionResult> CreateProfile([FromBody] PlayerProfileDto dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized();
        }

        var profileExists = await _context.PlayerProfiles.AnyAsync(pp => pp.UserId == userId);

        if (profileExists)
        {
            return BadRequest(new { message = "Profile already exists" });
        }

        var profile = new PlayerProfile
        {
            UserId = userId,
            Position = dto.Position,
            DominantFoot = dto.DominantFoot,
            Age = dto.Age,
            City = dto.City,
            Country = dto.Country,
            Bio = dto.Bio,
            HighlightUrl = dto.HighlightUrl,
            AvatarUrl = dto.AvatarUrl
        };

        _context.PlayerProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPlayerById),
            new { id = profile.Id },
            new
            {
                id = profile.Id,
                userId = profile.UserId,
                position = profile.Position,
                dominantFoot = profile.DominantFoot,
                age = profile.Age,
                city = profile.City,
                country = profile.Country,
                bio = profile.Bio,
                highlightUrl = profile.HighlightUrl,
                avatarUrl = profile.AvatarUrl,
                createdAt = profile.CreatedAt
            });
    }

    [HttpPut("profile")]
    [Authorize(Roles = "Player")]
    public async Task<IActionResult> UpdateProfile([FromBody] PlayerProfileDto dto)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized();
        }

        var profile = await _context.PlayerProfiles.FirstOrDefaultAsync(pp => pp.UserId == userId);

        if (profile is null)
        {
            return NotFound();
        }

        profile.Position = dto.Position;
        profile.DominantFoot = dto.DominantFoot;
        profile.Age = dto.Age;
        profile.City = dto.City;
        profile.Country = dto.Country;
        profile.Bio = dto.Bio;
        profile.HighlightUrl = dto.HighlightUrl;
        profile.AvatarUrl = dto.AvatarUrl;

        await _context.SaveChangesAsync();

        return Ok(profile);
    }

    [HttpGet("profile/me")]
    [Authorize(Roles = "Player")]
    public async Task<IActionResult> GetMyProfile()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized();
        }

        var profile = await _context.PlayerProfiles.FirstOrDefaultAsync(pp => pp.UserId == userId);

        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search(
        [FromQuery] string? position,
        [FromQuery] string? dominantFoot,
        [FromQuery] string? city,
        [FromQuery] string? country,
        [FromQuery] int? minAge,
        [FromQuery] int? maxAge)
    {
        var query = _context.PlayerProfiles
            .Include(pp => pp.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(position))
        {
            var value = position.ToLower();
            query = query.Where(pp => pp.Position.ToLower() == value);
        }

        if (!string.IsNullOrWhiteSpace(dominantFoot))
        {
            var value = dominantFoot.ToLower();
            query = query.Where(pp => pp.DominantFoot.ToLower() == value);
        }

        if (!string.IsNullOrWhiteSpace(city))
        {
            var value = city.ToLower();
            query = query.Where(pp => pp.City.ToLower() == value);
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            var value = country.ToLower();
            query = query.Where(pp => pp.Country.ToLower() == value);
        }

        if (minAge.HasValue)
        {
            query = query.Where(pp => pp.Age >= minAge.Value);
        }

        if (maxAge.HasValue)
        {
            query = query.Where(pp => pp.Age <= maxAge.Value);
        }

        var profiles = await query
            .Select(pp => new
            {
                id = pp.Id,
                fullName = pp.User.FullName,
                position = pp.Position,
                dominantFoot = pp.DominantFoot,
                age = pp.Age,
                city = pp.City,
                country = pp.Country,
                bio = pp.Bio,
                highlightUrl = pp.HighlightUrl,
                avatarUrl = pp.AvatarUrl
            })
            .ToListAsync();

        return Ok(profiles);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlayerById(int id)
    {
        var profile = await _context.PlayerProfiles
            .Include(pp => pp.User)
            .Include(pp => pp.MatchPlayers)
            .ThenInclude(mp => mp.Match)
            .FirstOrDefaultAsync(pp => pp.Id == id);

        if (profile is null)
        {
            return NotFound();
        }

        var totalGoals = profile.MatchPlayers.Sum(mp => mp.Goals);
        var totalAssists = profile.MatchPlayers.Sum(mp => mp.Assists);
        var totalMatchesPlayed = profile.MatchPlayers.Count;
        var averageRating = totalMatchesPlayed == 0
            ? 0
            : profile.MatchPlayers.Average(mp => mp.RatingOutOfTen);

        return Ok(new
        {
            id = profile.Id,
            userId = profile.UserId,
            fullName = profile.User.FullName,
            position = profile.Position,
            dominantFoot = profile.DominantFoot,
            age = profile.Age,
            city = profile.City,
            country = profile.Country,
            bio = profile.Bio,
            highlightUrl = profile.HighlightUrl,
            avatarUrl = profile.AvatarUrl,
            createdAt = profile.CreatedAt,
            totalGoals,
            totalAssists,
            totalMatchesPlayed,
            averageRating
        });
    }
}
