using USFParkingApp.Core.Entities;

namespace USFParkingApp.Core.Interfaces;

public interface IFavoriteRepository
{
    Task<IEnumerable<Favorite>> GetAllByUserIdAsync(string userId);
    Task<IEnumerable<ParkingSpot>> GetFavoriteParkingSpotsAsync(string userId);
    Task<Favorite> AddAsync(Favorite favorite);
    Task<bool> DeleteAsync(int id);
    Task<bool> IsFavoriteAsync(string userId, int parkingSpotId);
}