using USFParkingApp.Core.Entities;

namespace USFParkingApp.Core.Interfaces;

public interface IParkingSpotRepository
{
    Task<IEnumerable<ParkingSpot>> GetAllAsync();
    Task<ParkingSpot?> GetByIdAsync(int id);
    Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double? radius, decimal? maxPrice);
    Task<ParkingSpot> AddAsync(ParkingSpot parkingSpot);
    Task<bool> UpdateAsync(ParkingSpot parkingSpot);
    Task<bool> DeleteAsync(int id);
}