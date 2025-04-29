using System.Collections.Generic;
using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IParkingSpotRepository
    {
        Task<IEnumerable<ParkingSpot>> GetAllAsync();
        Task<ParkingSpot> GetByIdAsync(int id);
        Task<IEnumerable<ParkingSpot>> SearchAsync(string location, double radius);
        Task<ParkingSpot> AddAsync(ParkingSpot parkingSpot);
        Task UpdateAsync(ParkingSpot parkingSpot);
        Task DeleteAsync(ParkingSpot parkingSpot);
    }
}