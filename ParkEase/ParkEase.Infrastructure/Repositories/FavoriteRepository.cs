using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;

namespace ParkEase.Infrastructure.Repositories
{
    public class FavoriteRepository : Repository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(ParkEaseDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Favorite>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(f => f.UserId == userId)
                .Include(f => f.ParkingSpot)
                .ToListAsync();
        }

        public async Task<IEnumerable<ParkingSpot>> GetFavoriteSpotsByUserIdAsync(int userId)
        {
            return await _context.ParkingSpots
                .Where(p => p.Favorites.Any(f => f.UserId == userId))
                .ToListAsync();
        }

        public async Task<bool> IsFavoriteAsync(int userId, int parkingSpotId)
        {
            return await _dbSet.AnyAsync(f => f.UserId == userId && f.ParkingSpotId == parkingSpotId);
        }
    }
}