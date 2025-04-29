using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;

namespace ParkEase.Infrastructure.Repositories
{
    public class ParkingSpotRepository : IParkingSpotRepository
    {
        private readonly AppDbContext _context;
        private readonly IUniversityParkingService _universityParkingService;

        public ParkingSpotRepository(AppDbContext context, IUniversityParkingService universityParkingService)
        {
            _context = context;
            _universityParkingService = universityParkingService;
        }

        public async Task<IEnumerable<ParkingSpot>> GetAllAsync()
        {
            var dbParkingSpots = await _context.ParkingSpots.ToListAsync();
            var universityParkingSpots = await _universityParkingService.GetParkingSpotsAsync();
            
            return dbParkingSpots.Concat(universityParkingSpots);
        }

        public async Task<ParkingSpot> GetByIdAsync(int id)
        {
            return await _context.ParkingSpots.FindAsync(id);
        }

        public async Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double radius)
        {
            // In a real implementation, would use geolocation calculations
            // For now, return spots that match the city/location
            var dbParkingSpots = await _context.ParkingSpots
                .Where(p => p.City.Contains(location) || p.Address.Contains(location))
                .ToListAsync();
                
            var universityParkingSpots = await _universityParkingService.GetParkingSpotsAsync();
            var filteredUniversitySpots = universityParkingSpots
                .Where(p => p.City.Contains(location) || p.Address.Contains(location))
                .ToList();
            
            return dbParkingSpots.Concat(filteredUniversitySpots);
        }

        public async Task<ParkingSpot> AddAsync(ParkingSpot parkingSpot)
        {
            parkingSpot.CreatedAt = DateTime.UtcNow;
            parkingSpot.UpdatedAt = DateTime.UtcNow;
            
            await _context.ParkingSpots.AddAsync(parkingSpot);
            await _context.SaveChangesAsync();
            
            return parkingSpot;
        }

        public async Task UpdateAsync(ParkingSpot parkingSpot)
        {
            parkingSpot.UpdatedAt = DateTime.UtcNow;
            
            _context.ParkingSpots.Update(parkingSpot);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ParkingSpot parkingSpot)
        {
            _context.ParkingSpots.Remove(parkingSpot);
            await _context.SaveChangesAsync();
        }
    }
}