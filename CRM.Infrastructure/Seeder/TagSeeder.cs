using CRM.Core.Entities;
using CRM.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Seeders;

public static class TagSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Tags.Any()) return;

        var tags = new List<Tag>
        {
            new() { Name = "VIP",         Color = "#f59e0b", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Loyal",       Color = "#34d399", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "New",         Color = "#60a5fa", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Corporate",   Color = "#818cf8", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "At Risk",     Color = "#f87171", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Follow Up",   Color = "#fb923c", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Premium",     Color = "#e879f9", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Referral",    Color = "#2dd4bf", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Warranty",    Color = "#facc15", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Name = "Blacklisted", Color = "#475569", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
        };

        context.Tags.AddRange(tags);
        context.SaveChanges();
    }
}