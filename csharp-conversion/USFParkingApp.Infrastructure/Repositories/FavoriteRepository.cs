using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Data;

namespace USFParkingApp.Infrastructure.Repositories;

public class FavoriteRepository : RepositoryBase<Favorite>, IFavoriteRepository
{
    public FavoriteRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public async Task<IEnumerable<Favorite>> GetAllByUserIdAsync(string userId)
    {
        return await _dbSet
            .Include(f => f.ParkingSpot)
            .Where(f => f.UserId == userId)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<ParkingSpot>> GetFavoriteParkingSpotsAsync(string userId)
    {
        var favorites = await GetAllByUserIdAsync(userId);
        return favorites.Select(f => f.ParkingSpot).ToList();
    }
    
    public async Task<bool> IsFavoriteAsync(string userId, int parkingSpotId)
    {
        return await _dbSet
            .AnyAsync(f => f.UserId == userId && f.ParkingSpotId == parkingSpotId);
    }
}