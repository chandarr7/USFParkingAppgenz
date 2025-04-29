using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using ParkEase.Infrastructure.Data;

namespace ParkEase.Infrastructure.Repositories
{
    public class ReservationRepository : Repository<Reservation>, IReservationRepository
    {
        public ReservationRepository(ParkEaseDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(r => r.UserId == userId)
                .Include(r => r.ParkingSpot)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetByParkingSpotIdAsync(int parkingSpotId)
        {
            return await _dbSet
                .Where(r => r.ParkingSpotId == parkingSpotId)
                .Include(r => r.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetWithDetailsAsync()
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .ToListAsync();
        }

        public override async Task<Reservation> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.ParkingSpot)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}