using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParkEase.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<ApplicationDbContext>>();
            var context = services.GetRequiredService<ApplicationDbContext>();
            var externalService = services.GetRequiredService<IExternalParkingService>();

            try
            {
                logger.LogInformation("Ensuring database is created and migrated...");
                
                // Ensure database is created and migrated
                await context.Database.MigrateAsync();
                
                // Seed users if none exist
                if (!await context.Users.AnyAsync())
                {
                    logger.LogInformation("Seeding users...");
                    await SeedUsersAsync(context);
                }
                
                // Seed parking spots from external service if none exist
                if (!await context.ParkingSpots.AnyAsync())
                {
                    logger.LogInformation("Fetching and seeding parking spots from Tampa ArcGIS API...");
                    await SeedParkingSpotsAsync(context, externalService);
                }

                logger.LogInformation("Database initialization completed successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }

        private static async Task SeedUsersAsync(ApplicationDbContext context)
        {
            var users = new List<User>
            {
                new User
                {
                    Username = "demo_user",
                    Name = "Demo User",
                    Email = "demo@parkease.com",
                    PasswordHash = "AQAAAAEAACcQAAAAEHxbULGS7bU53KRrB5rc0RKl+EvG1UcxzIKbMCQ7v8yV9Gg+QCzJVyAI2OCY/Xwybg==", // demo123
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Username = "admin_user",
                    Name = "Admin User",
                    Email = "admin@parkease.com",
                    PasswordHash = "AQAAAAEAACcQAAAAEIpfQ4kdrkOEofm7+fxiCz9fj1fzKqrPd3tklexBp+V9NMc2iRu+3Gw5bAqy4oOUBw==", // admin123
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }

        private static async Task SeedParkingSpotsAsync(ApplicationDbContext context, IExternalParkingService externalService)
        {
            var externalParkingSpots = await externalService.GetParkingDataAsync();
            
            if (externalParkingSpots.Any())
            {
                // Only add Tampa ArcGIS parking spots from the external service
                var parkingSpots = externalParkingSpots.ToList();
                
                // Also add a few manual ParkEase spots
                parkingSpots.AddRange(new List<ParkingSpot>
                {
                    new ParkingSpot 
                    {
                        Name = "USF Parking Garage 1",
                        Address = "USF Holly Drive",
                        City = "Tampa",
                        Price = 4.99M,
                        AvailableSpots = 100,
                        Latitude = 28.0639,
                        Longitude = -82.4128,
                        Rating = 4.5,
                        Source = "ParkEase",
                        ExternalId = null
                    },
                    new ParkingSpot 
                    {
                        Name = "USF Library Parking",
                        Address = "USF Campus",
                        City = "Tampa",
                        Price = 2.99M,
                        AvailableSpots = 50,
                        Latitude = 28.0589,
                        Longitude = -82.4138,
                        Rating = 4.2,
                        Source = "ParkEase",
                        ExternalId = null
                    }
                });

                await context.ParkingSpots.AddRangeAsync(parkingSpots);
                await context.SaveChangesAsync();
            }
        }
    }
}