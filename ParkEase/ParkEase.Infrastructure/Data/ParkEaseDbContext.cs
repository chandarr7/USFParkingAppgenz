using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Models;

namespace ParkEase.Infrastructure.Data
{
    public class ParkEaseDbContext : DbContext
    {
        public ParkEaseDbContext(DbContextOptions<ParkEaseDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ParkingSpot> ParkingSpots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure User entity
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reservations)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Favorites)
                .WithOne(f => f.User)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ParkingSpot entity
            modelBuilder.Entity<ParkingSpot>()
                .HasMany(p => p.Reservations)
                .WithOne(r => r.ParkingSpot)
                .HasForeignKey(r => r.ParkingSpotId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ParkingSpot>()
                .HasMany(p => p.Favorites)
                .WithOne(f => f.ParkingSpot)
                .HasForeignKey(f => f.ParkingSpotId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Favorite entity
            modelBuilder.Entity<Favorite>()
                .HasIndex(f => new { f.UserId, f.ParkingSpotId })
                .IsUnique();

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "johndoe", Name = "John Doe", Email = "john@example.com" }
            );

            // Seed ParkingSpots
            modelBuilder.Entity<ParkingSpot>().HasData(
                new ParkingSpot
                {
                    Id = 1,
                    Name = "Collins Garage",
                    Address = "123 Main St",
                    City = "Tampa",
                    Price = 5.00m,
                    AvailableSpots = 75,
                    Rating = 4.5m,
                    Latitude = 27.9506,
                    Longitude = -82.4572,
                    Source = "tampa_api",
                    ExternalId = "1001"
                },
                new ParkingSpot
                {
                    Id = 2,
                    Name = "Laurel Drive",
                    Address = "456 Elm St",
                    City = "Tampa",
                    Price = 3.50m,
                    AvailableSpots = 32,
                    Rating = 4.2m,
                    Latitude = 27.9510,
                    Longitude = -82.4580,
                    Source = "tampa_api",
                    ExternalId = "1002"
                },
                new ParkingSpot
                {
                    Id = 3,
                    Name = "Crescent Hill",
                    Address = "789 Oak St",
                    City = "Tampa",
                    Price = 4.25m,
                    AvailableSpots = 120,
                    Rating = 4.7m,
                    Latitude = 27.9520,
                    Longitude = -82.4560,
                    Source = "tampa_api",
                    ExternalId = "1003"
                }
            );
        }
    }
}