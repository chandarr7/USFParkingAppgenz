using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Models;

namespace ParkEase.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ParkingSpot> ParkingSpots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Name).HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure ParkingSpot entity
            modelBuilder.Entity<ParkingSpot>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
                entity.Property(e => e.City).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.Source).HasMaxLength(100);
                entity.Property(e => e.ExternalId).HasMaxLength(100);
                entity.Ignore(e => e.Distance); // Calculated property, not stored in DB
            });

            // Configure Reservation entity
            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.VehicleType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LicensePlate).IsRequired().HasMaxLength(20);
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);

                // Define relationships
                entity.HasOne(r => r.User)
                      .WithMany(u => u.Reservations)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.ParkingSpot)
                      .WithMany(p => p.Reservations)
                      .HasForeignKey(r => r.ParkingSpotId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Favorite entity
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Define relationships
                entity.HasOne(f => f.User)
                      .WithMany(u => u.Favorites)
                      .HasForeignKey(f => f.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.ParkingSpot)
                      .WithMany(p => p.Favorites)
                      .HasForeignKey(f => f.ParkingSpotId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Create composite unique index
                entity.HasIndex(f => new { f.UserId, f.ParkingSpotId }).IsUnique();
            });
        }
    }
}