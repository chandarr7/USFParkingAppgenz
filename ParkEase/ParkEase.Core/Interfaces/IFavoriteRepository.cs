using System.Collections.Generic;
using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IFavoriteRepository : IRepository<Favorite>
    {
        Task<IEnumerable<Favorite>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ParkingSpot>> GetFavoriteSpotsByUserIdAsync(int userId);
        Task<bool> IsFavoriteAsync(int userId, int parkingSpotId);
    }
}