using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Entities.Visualization;

namespace USFParkingApp.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<ParkingSpot> ParkingSpots { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Favorite> Favorites { get; set; } = null!;
    
    // Visualization data sets
    public DbSet<CapacityData> CapacityData { get; set; } = null!;
    public DbSet<UsageData> UsageData { get; set; } = null!;
    public DbSet<TrendData> TrendData { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Configure relationships between entities
        
        // ParkingSpot <-> Reservations (One-to-Many)
        builder.Entity<Reservation>()
            .HasOne(r => r.ParkingSpot)
            .WithMany(p => p.Reservations)
            .HasForeignKey(r => r.ParkingSpotId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // User <-> Reservations (One-to-Many)
        builder.Entity<Reservation>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reservations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // User <-> Payments (One-to-Many)
        builder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany(u => u.Payments)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Payment <-> Reservations (One-to-Many)
        builder.Entity<Reservation>()
            .HasOne(r => r.Payment)
            .WithMany(p => p.Reservations)
            .HasForeignKey(r => r.PaymentId)
            .OnDelete(DeleteBehavior.SetNull);
            
        // User <-> Favorites (One-to-Many)
        builder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // ParkingSpot <-> Favorites (One-to-Many)
        builder.Entity<Favorite>()
            .HasOne(f => f.ParkingSpot)
            .WithMany(p => p.Favorites)
            .HasForeignKey(f => f.ParkingSpotId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Add unique index to prevent duplicate favorites
        builder.Entity<Favorite>()
            .HasIndex(f => new { f.UserId, f.ParkingSpotId })
            .IsUnique();
    }
}