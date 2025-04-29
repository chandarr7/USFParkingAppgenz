using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Data;

namespace USFParkingApp.Infrastructure.Repositories;

public class ParkingSpotRepository : RepositoryBase<ParkingSpot>, IParkingSpotRepository
{
    public ParkingSpotRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public override async Task<IEnumerable<ParkingSpot>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.Reservations)
            .Include(p => p.Favorites)
            .ToListAsync();
    }
    
    public override async Task<ParkingSpot?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Reservations)
            .Include(p => p.Favorites)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    
    public async Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double? radius, decimal? maxPrice)
    {
        var query = _dbSet.AsQueryable();
        
        // Apply filters if provided
        if (!string.IsNullOrWhiteSpace(location))
        {
            // This is a simplistic search - in a real app, we would use geospatial queries
            query = query.Where(p => p.Location.Contains(location));
        }
        
        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.HourlyRate <= maxPrice.Value);
        }
        
        // For radius search, we would need to calculate distance based on latitude/longitude
        // This would typically use SQL spatial functions or a geospatial library
        
        return await query
            .Include(p => p.Reservations)
            .ToListAsync();
    }
    
    public async Task<bool> UpdateAsync(ParkingSpot parkingSpot)
    {
        var existingSpot = await GetByIdAsync(parkingSpot.Id);
        if (existingSpot == null)
            return false;
            
        _context.Entry(existingSpot).CurrentValues.SetValues(parkingSpot);
        return true;
    }
}